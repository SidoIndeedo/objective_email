// Replace with your Cerebras API call
async function summarizeEmail(text) {
  // Call Cerebras API here and return { summary, tags, isImportant }
  return {
    summary: text.slice(0, 100), // temp mock
    tags: ["Example"],
    isImportant: false
  };
}

module.exports = { summarizeEmail };
