function testFunction() {
    fetch('/api')
    .then((response) => response.text())
    .then((response) => {
         console.log(response);
    })
}