const axios = require('axios').default;
const {config} = require('./config');


/**
 *  Params:
 *    name: string, // name of conversation
 *    placeholder: ?string, // placeholder prompt
 *    roleNames: ?Object, // mapping roles to display names
 *    modelParams: Object, // see below
 *  ModelParams:
 *    temperature: 0 - 1, (1)
 *    top_p: 0 - 1, (1)
 *    max_tokens: 0 - 4096,  (4096)
 *    n: how many choices, (1)
 *    model
 *
 *  Messages:
 *    Array<{role: user | system | assistant, content: string}>
 */
const createConversation = (params, messages) => {
  return {
    model: config.defaultModel,
    name: '',
    tokens: 0,
    placeholder: '',
    ...params,
    modelParams: params.modelParams ?? {},
    messages: messages ?? [],
  };
}

const createModelParams = (model) => {
  return {
    temperature: 1,
    top_p: 1,
    max_tokens: model
      ? config.modelToMaxTokens[model]
      : config.modelToMaxTokens[config.defaultModel],
    n: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };
}

const getModelParamBounds = (model) => {
  return {
    temperature: {min: 0, max: 1, inc: 0.1},
    top_p: {min: 0, max: 1, inc: 0.1},
    max_tokens: {min: 0, max: model ? config.modelToMaxTokens[model] : 4096, inc: 1},
    n: {min: 1, max: 5, inc: 1},
    frequency_penalty: {min: -2, max: 2, inc: 0.1},
    presence_penalty: {min: -2, max: 2, inc: 0.1},
  }
}

const submitConversation = (conversation, apiKey) => {
  const axiosInstance = axios.create({
    baseURL: "https://api.openai.com/v1/chat/completions",
  });

  // HACK: need to prevent requesting too many tokens
  let max_tokens = Infinity;
  if (
    conversation.modelParams.max_tokens &&
    conversation.modelParams.max_tokens +
      conversation.tokens < config.modelToMaxTokens[conversation.model]
  ) {
    max_tokens = conversation.modelParams.max_tokens;
  }
  return axiosInstance.post('', {
    model: conversation.model,
    messages: conversation.messages,
    ...conversation.modelParams,
    max_tokens,
  }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: "Bearer " + (apiKey ?? localStorage.getItem("gptAPIKey"))
    }
  }).then((completion) => {
    const responseMessage = completion.data.choices[0].message.content.trim();
    return new Promise((resolve, reject) => {
      resolve({
        message: {role: 'assistant', content: responseMessage},
        tokens: completion.data.usage.total_tokens,
        finishReason: completion.data.choices[0].finish_reason,
      });
    });
  });
}


const addMessage = (conversation, message) => {
  let messageToAdd = message;
  if (typeof message == 'string') { // allow just adding message as a string with role: user implied
    messageToAdd = {role: 'user', content: message};
  }
  return {
    ...conversation,
    messages: [...conversation.messages, messageToAdd],
  };
}

module.exports = {
  createConversation,
  submitConversation,
  addMessage,
  createModelParams,
  getModelParamBounds,
};
