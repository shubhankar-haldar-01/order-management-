const AuthService = require("../services/auth.service");

class AuthController {
  async register(req, res) {

    try {
      const {name, email, password, role } = req.body
      const response = await AuthService.register({name, email, password, role });

      if(response.error){
        throw{
          status: response.status,
          message: response.message,
          error: response.error
        }
      }

      res.status(response.status).json({
        message:response.message,
        status: response.status,
        error: response.error,
      });
      
    } catch (error) {
      res.status(error.status).json({
        message: error.message,
        status: error.status,
        error: error.error || true,
      })
    }
  }

  async login(req, res) {

    try {
      const  {email, password} = req.body
      const response = await AuthService.login({email, password});

      if(response.error){
        throw{
          status: response.status,
          message: response.message,
          error: response.error
        }
      }

      res.status(response.status).json({
        message:response.message,
        status: response.status,
        data: response.data,
        error: response.error,
    });
      
    } catch (error) {
      res.status(error.status).json({
        message: error.message,
        status: error.status,
        error: error.error || true,
      })
    }
  }
}

module.exports = new AuthController();
