// Rewrites any request for a path with no file extension (i.e. a client-side
// route like /courses/123) to /index.html, so React Router can handle it.
// Only attached to the default (S3/static) cache behavior — never to
// /api/*, so this can't rewrite an API 404 into an HTML page.
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var lastSegment = uri.substring(uri.lastIndexOf("/") + 1);

  if (uri.endsWith("/")) {
    request.uri += "index.html";
  } else if (lastSegment.indexOf(".") === -1) {
    request.uri = "/index.html";
  }

  return request;
}
