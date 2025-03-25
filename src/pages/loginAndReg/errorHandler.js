export default function (e){
    const errorCode = e.code;
    let error = null;
    console.log(e)
    switch(errorCode){
      case "auth/invalid-email":
        error="Please enter a valid email address!"
        break;
      case "auth/missing-password":
        error="Please enter a password!"
        break;
      case "auth/weak-password":
        error="Please enter a stronger password!"
        break;
      case "auth/email-already-in-use":
        error="User already exists!"
        break;
      case "auth/invalid-credential":
        error="Username or password is incorrect!"
        break;
      default:
        error=null
    }
    return error
}