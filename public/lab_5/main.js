function testFunction() {
    fetch('/api')
    .then((response) => response.text())
    .then((response) => {
         console.log(response);
    })
    document.querySelector("title").innerHTML = 'response.text()';
    document.querySelector("h1").innerHTML = 'response.text()';
    document.body.style.backgroundColor = 'rgb(113, 2, 2)';
    document.getElementsByClassName('flex-outer').style.margin = '0px';
    document.querySelector("p.checkbox-list-label").innerHTML = 'Fruits';

    var fruits = ["banana", "durian", "pineapple"];
    document.querySelectorAll(".flex-inner li").forEach(fruitsFunction);

    function fruitsFunction(item, index) {
        item.innerHTML = fruits[index];
    }
}