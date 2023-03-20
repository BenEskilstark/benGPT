const {Configuration, OpenAIApi} = require("openai");
const axios = require('axios').default;


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
    model: 'gpt-3.5-turbo',
    ...params,
    modelParams: params.modelParams ?? {},
    messages: messages ?? [],
  };
}

const createModelParams = () => {
  return {
    temperature: 1,
    top_p: 1,
    max_tokens: 4096,
    n: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };
}

const getModelParamBounds = () => {
  return {
    temperature: {min: 0, max: 1, inc: 0.1},
    top_p: {min: 0, max: 1, inc: 0.1},
    max_tokens: {min: 0, max: 4096, inc: 1},
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
    conversation.modelParams.max_tokens + conversation.tokens < 4096
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

// This version only runs on a server
const submitConversationAPI = (conversation, api) => {
  const openAI = api ?? createAPI();
  // HACK: need to prevent requesting too many tokens
  let max_tokens = Infinity;
  if (
    conversation.modelParams.max_tokens &&
    conversation.modelParams.max_tokens + conversation.tokens < 4096
  ) {
    max_tokens = conversation.modelParams.max_tokens;
  }
  return openAI.createChatCompletion({
    model: conversation.model,
    messages: conversation.messages,
    ...conversation.modelParams,
    max_tokens,
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

const createAPI = (apiKey) => {
  const configuration = new Configuration({
    apiKey: apiKey // ?? require('../.secrets').gptAPIKey,
  });
  return new OpenAIApi(configuration);
}

const addMessage = (conversation, message) => {
  return {
    ...conversation,
    messages: [...conversation.messages, message],
  };
}

module.exports = {
  createConversation,
  submitConversation,
  createAPI,
  addMessage,
  createModelParams,
  getModelParamBounds,
};
