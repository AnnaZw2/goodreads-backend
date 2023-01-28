require(`dotenv-defaults`).config({
  path: './.env',
  encoding: 'utf8',
  defaults: './.env.defaults' 
})

module.exports = {
    default: {
      formatOptions: {"snippetInterface": "synchronous"},
      publishQuiet: true,
      worldParameters: { 
        config: {baseURL : process.env.BASE_URL, jwtTokenUserValid: process.env.JWT_TOKEN_ADMIN_VALID, jwtTokenUserValid: process.env.JWT_TOKEN_ADMIN_VALID, jwtTokenInvalid: process.env.JWT_TOKEN_INVALID} 
      },
  }
}