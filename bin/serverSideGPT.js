// Example only

// const {
//   Configuration,
//   OpenAIApi
// } = require("openai");
//
// // This version only runs on a server
// const submitConversationAPI = (conversation, api) => {
//   const openAI = api ?? createAPI();
//   // HACK: need to prevent requesting too many tokens
//   let max_tokens = Infinity;
//   if (conversation.modelParams.max_tokens && conversation.modelParams.max_tokens + conversation.tokens < 4096) {
//     max_tokens = conversation.modelParams.max_tokens;
//   }
//   return openAI.createChatCompletion({
//     model: conversation.model,
//     messages: conversation.messages,
//     ...conversation.modelParams,
//     max_tokens
//   }).then(completion => {
//     const responseMessage = completion.data.choices[0].message.content.trim();
//     return new Promise((resolve, reject) => {
//       resolve({
//         message: {
//           role: 'assistant',
//           content: responseMessage
//         },
//         tokens: completion.data.usage.total_tokens,
//         finishReason: completion.data.choices[0].finish_reason
//       });
//     });
//   });
// };
//
// // NOTE: if this gets required on the clientside it will leak the API key!
// const createAPI = apiKey => {
//   const configuration = new Configuration({
//     apiKey: apiKey ?? require('../.secrets').gptAPIKey
//   });
//   return new OpenAIApi(configuration);
// };
// module.exports = {
//   submitConversationAPI,
//   createAPI
// };