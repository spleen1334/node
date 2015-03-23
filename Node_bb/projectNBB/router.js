// ROUTER
// "Making different http req point at different parts of
// our code is called routing"

function route(handle, pathname, response, postData) {
  console.log("About to route a request for " + pathname);

  // REQ HANDLER provera
  // ukoliko je funkcija znaci da imamo definisan
  // req handler za trazeni URL
  if (typeof handle[pathname] === 'function') {
    // handle[pathname](response, postData); // ubacen response kao parametar za start(), dodat i postData iz server
    handle[pathname](response, request); // umesto postData prosledjuje se request (FINAL VERZIJA)
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"content-type": "text/plain"});
    response.write("404 Not found!");
    response.end();
  }
}

exports.route = route;
