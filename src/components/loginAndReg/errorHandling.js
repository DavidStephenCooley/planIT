export default function (e){
    const errorCode = e.code;
    let error = null;
    console.log(errorCode)
    switch(errorCode){
      case "auth/invalid-email":
        error="please enter a valid email address"
        break;
      case "auth/missing-password":
        error="please enter a password"
        break;
      case "auth/weak-password":
        error="please enter a stronger password"
        break;
      case "auth/email-already-in-use":
        error="user already exists"
        break;
      default:
        error = null
    }
    return error
}