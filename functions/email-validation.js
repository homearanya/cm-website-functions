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
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 200, // <-- Important!
      headers,
      body: "This was not a POST request!",
    }
  }

  // some error checking:
  if (event.httpMethod !== "POST" || !event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: "bad-payload",
        message: "Incorrect or incomplete http request",
      }),
    }
  }

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
      headers,
      body: JSON.stringify({ valid: validEmail }),
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      headers,
      body: "Error in validation",
    }
  }
}
