// const axios = require("axios");

// // POST /api/ai/generate-description
// const generateDescription = async (req, res) => {
//   try {
//     const { productName, category } = req.body;

//     if (!productName) {
//       return res.status(400).json({ message: "Product name is required" });
//     }

//     const prompt = `Write a short, compelling product description for an offline local shop product.
// Product name: ${productName}
// ${category ? `Shop category: ${category}` : ""}

// Requirements:
// - 2-3 sentences only
// - Friendly and appealing tone
// - Highlight key benefits
// - No made-up specifications or fake claims
// - Sound natural, not like a corporate ad
// - End without a call to action

// Just write the description, nothing else.`;

//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [{ parts: [{ text: prompt }] }],
//       },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     const description =
//       response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

//     if (!description) {
//       return res.status(500).json({ message: "Failed to generate description" });
//     }

//     res.json({ description });
//   } catch (err) {
//     console.log("generateDescription ERROR:", err?.response?.data || err.message);
//     res.status(500).json({ message: "AI generation failed" });
//   }
// };

// module.exports = { generateDescription };


const axios = require("axios");

// POST /api/ai/generate-description
const generateDescription = async (req, res) => {
  try {
    const { productName, category } = req.body;

    if (!productName) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const prompt = `Write a simple, easy-to-understand product description for a local shop product.
Product name: ${productName}
${category ? `Shop category: ${category}` : ""}

Requirements:
-you take yourself as vendor who want to sell it product and you are showing this product to you customer so manipulate and convince them.
-no hii hello give description as you are doing marketing of the product.
- 1-2 sentences only
- Use very simple, everyday English words
- Avoid technical or fancy words
- Write like you are telling a friend about the product
- Focus on what the product is and how it helps in daily life
- Should be understood by someone with basic English knowledge

Just write the description, nothing else.`;

    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-small-latest", // free tier model
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
      }
    );

    const description = response.data?.choices?.[0]?.message?.content?.trim();

    if (!description) {
      return res.status(500).json({ message: "Failed to generate description" });
    }

    res.json({ description });
  } catch (err) {
    console.log("generateDescription ERROR:", err?.response?.data || err.message);
    res.status(500).json({ message: "AI generation failed" });
  }
};

module.exports = { generateDescription };