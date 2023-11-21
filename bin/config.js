const config = {
  modelToMaxTokens: {
    'gpt-3.5-turbo': 4096,
    'gpt-3.5-turbo-16k': 16384,
    'gpt-4-0613': 8192,
    'gpt-4-32k-0613': 32768,
    'gpt-4-1106-preview': 128000
  },
  defaultModel: 'gpt-4-1106-preview'
};
module.exports = {
  config
};