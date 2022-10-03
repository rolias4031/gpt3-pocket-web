// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

/*
 * this endpoint serves the completion request for the gpt-3 pocket chrome extension.
 * requests should include body.prompt
 */

const config = {
  model: 'text-davinci-002',
  max_tokens: 500,
};

export default async function handler(req, res) {
  // reflight request check for cors
  if (req.method == 'OPTIONS') {
    res.setHeader('Allow', 'POST');
    return res.status(202).json({});
  }
  // config request
  const url = 'https://api.openai.com/v1/completions';
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: config.model,
      prompt: req.body.prompt,
      max_tokens: config.max_tokens,
    }),
  };
  // make request
  try {
    const response = await fetch(url, fetchOptions);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    return res.status(200).json({
      message: 'Success',
      result,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
