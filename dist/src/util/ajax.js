const ajax = (options, callback) => {
  const xhr = new XMLHttpRequest();
  const DONE = 4;
  const OK = 200;

  xhr.onreadystatechange = function() {
    if ( xhr.readyState === DONE ) {
      if ( xhr.status === OK ) {
        console.log("success");
        callback(xhr.response);
      } else {
        console.log('request has failed', xhr.status);
      }
    }
  }

  xhr.open(
    options["method"],
    options["url"],
    true
  );

  xhr.responseType = 'json';
  xhr.send();

}

export default ajax;