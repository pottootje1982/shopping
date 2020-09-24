const { getCookie } = require("./cookie")

describe("AhApi", () => {
  it("extracts ah_token", () => {
    const cookies = [
      "SSLB=1; path=/; domain=www.ah.nl",
      "ah_token=62052875_ccc9-4a30-989a-d551cfacef8f.199…49fd-90b0-4d3820d9cb3a; Path=/; HttpOnly; Secure",
      "ah_session=bqsXGn5rEiCoBEIpLmxDUQ.iF6WzNQyVuyVUzn… expires=Sun, 26 Sep 2021 10:26:25 GMT; httponly",
      "TS01fb4f52=01919b9b649a3b6490496dc339ad3fe0db1d6d…80c6c88031ff798aa44134807b96a77b255ed60b; Path=/",
      "TS0163d06f=01919b9b640090464f4caed699f44773b23a1b…c041d21164e9e01f67972b; path=/; domain=www.ah.nl",
    ]
    expect(getCookie(cookies, "ah_token")).toBe(
      "62052875_ccc9-4a30-989a-d551cfacef8f.199…49fd-90b0-4d3820d9cb3a"
    )
  })
})
