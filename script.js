$(document).ready(function(){  
  data.sort(function (a, b) {return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1});
  const fuse = new Fuse(data, {keys:["name"]});

  var header, currentList;
  var contactContainer = $("#contactcontainer");
  for (var i = 0; i < data.length; i++){
    var firstLetter = data[i].name.charAt(0).toUpperCase();
    if (!isNaN(firstLetter) && header === undefined){
      contactContainer.append(`<div class="alphabetizer">#</div>`);
      header = "#";
      currentList = contactContainer.append('<div class="contactlist"/>');
    }
    else if (firstLetter !== header && !(!isNaN(firstLetter) && header === "#")){
      contactContainer.append(`<div class="alphabetizer">${firstLetter}</div>`);
      header = firstLetter;
      currentList = contactContainer.append('<div class="contactlist"/>');
    }
    addAnimation(currentList.append(`<a href="tel:${makePhone(data[i].number)}" class="contactlink"><div class="contact">${data[i].name} - ${data[i].number}</div></a>`));
  }

  $(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
  });

  var contactContainerHtml = contactContainer.html();

  $("#searchbar").on("input change", function (){
    var input = $(this).val();
    if (input.length === 0){
      contactContainer.html(contactContainerHtml);
    } else {
      contactContainer.html("");
      var result = fuse.search(input);
      var contacts = contactContainer.append('<div class="contactlist"/>');
      for (var i = 0; i < result.length; i++){
        addAnimation(contacts.append(`<a href="tel:${makePhone(result[i].item.number)}" class="contactlink"><div class="contact">${result[i].item.name} - ${result[i].item.number}</div></a>`));
      }
    }
    addAnimation();
  });

  window.onscroll = function() {
    if ($(document).scrollTop() >= 200) {
      $("#returntop").css('display', 'block');
    } else {
      $("#returntop").css('display', 'none');
    }
  };

  addAnimation();

  $("#phone").on("click", function() {
    $('#phonebook').attr("hidden", true);
    $('#dialer').show();
    $(this).css('color', "#1976d2");
    $("#contacts").css('color', "black")
  });

  $('#contacts').on("click", function () {
    $('#phonebook').attr("hidden", false);
    $('#dialer').hide();
    $(this).css('color', "#1976d2");
    $("#phone").css('color', "black")
  });

  $(".digit").on("click", function () {
    var num = $(this).clone().children().remove().end().text();
    if ($('#output').text().length < 5) {
      $("#output").append("<span>" + num.trim() + "</span>");
    }
    var dial = $('#output').text();
    if (dial.length === 5) {
      $("#call").css("background-color", "#66bb6a").on("vmouseup", function () {
        $(this).css("background-color", "#66bb6a");
      })
      .on("vmousedown", function () {
        $(this).css("background-color", "#81c784");
      })
      .attr("href", "tel:" + makePhone(dial));

      for (var i = 0; i < data.length; i++){
        if (data[i].number === dial){
          $("#match").html(data[i].name);
        }
      }
    }
  });

  $("#backspace").on("click", function () {
    $('#match').html('');
    var number = $('#output').text();
    var count = number.length;
    if (count > 0) {
      $("#output span:last-child").remove();
    }
    var call = $("#call");  
    call.unbind()
      .css("background-color", "#e6e6e6")
      .attr("href", "#");
  });
});

function makePhone(input){
 return (input.charAt(0) == "6" ? 
        "+131292" : (input.charAt(0) == "2" ? 
          "+131247" : "+131269")) + input;
}

function addAnimation(){
  $(".digit, .dig, .contact").on("mousedown touchstart", function () {
    $(this).css("background-color", "#e6e6e6");
  })

  .on("touchend mouseup mouseleave", function () {
    $(this).css("background-color", "transparent");
  });
}