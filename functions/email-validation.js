require("dotenv").config({
  path: `.env`,
})

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTION",
}

const fetch = require("node-fetch")

exports.handler = async event => {
  const { email } = JSON.parse(event.body)
  try {
    const response = await fetch(
      `https://api.kickbox.com/v2/verify?email=${email}&apikey=${process.env.KICKBOX_API_KEY}`
    )
    const data = await response.json()
    const { result } = data

    let validEmail = false
    if (result !== "undeliverable") {
      validEmail = true
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ valid: validEmail }),
      headers,
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: "Error in validation",
      headers,
    }
  }
}
