export default defineEventHandler(async (event) => {
  // handle post data
  // const { age } = await useBody(event)
  // since laravel_session cookie is marked as "httponly"(inspect brwser and check application tab under cookies
  // then it can't be accessed from client side,
  // we can only to access it from here (server side)
  const laravel_session_cookie = "laravel_session";
  deleteCookie(event, laravel_session_cookie);

  return true;
})