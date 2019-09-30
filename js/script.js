// import Cropper from 'cropperjs';
// var canvas  = $("#canvas")
var canvas  = $("#canvas"),
    context = canvas.get(0).getContext("2d"),
    $result = $('#result');

 
$('body').on( 'change', '#fileInput',function(){

    if (this.files && this.files[0]) {
      if ( this.files[0].type.match(/^image\//) ) {
        // console.log(this.files[0])
        // console.log(this.files)
        var reader = new FileReader();
        reader.onload = function(evt) {
           var img = new Image();
           context.clearRect(0,0,img.height, img.width)
           img.onload = function() {
             context.canvas.height = img.height;
             context.canvas.width  = img.width;
             context.drawImage(img, 0, 0);
             // Destroy the old cropper instance
             canvas.cropper('destroy');
             $result.empty();

             // Replace url
             canvas.attr('src', this.result);

             var cropper = canvas.cropper({
               // aspectRatio: 16 / 9
               viewMode:1,
               background:false,
               zoomOnWheel:false
             });
             $('#btnCrop').click(function() {
                // Get a string base 64 data url
                var croppedImageDataURL = canvas.cropper('getCroppedCanvas').toDataURL("image/png"); 
                $result.empty()
                $result.append( $('<img>').attr({'src': croppedImageDataURL,
                                                 'id': "cropped_img",
                                                 'style': "position: absolute; top:0; left: 0; right: 0; bottom: 0; margin:auto; height:inherit; display: inline-block;max-width: 90%;"
                                               }) );
             });
             $('#btnRestore').click(function() {
               canvas.cropper('reset');
               $result.empty();
             });
           };
           img.src = evt.target.result;
        };
        reader.readAsDataURL(this.files[0]);
      }
      else {
        alert("Invalid file type! Please select an image file.");
      }
    }
    else {
      alert('No file(s) selected.');
    }
});

function createCORSRequest(method, url){
  var xhttp=new XMLHttpRequest();
  if ("withCredentials" in xhttp){
    xhttp.open(method, url, true);
  } 
  else if (typeof XDomainRequest != "undefined"){
    xhttp= new XDomainRequest();
    xhttp.open(method, url);
  }
  else{
    xhttp=null;
  }
  return xhttp;
}


function dataURItoBlob(dataURI) {
    // https://gist.github.com/davoclavo/4424731
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
    }

    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView], { type: mimeString });
    return blob;
}

function showUnwarped(){
  $uw = $('#uwdiv');
  $wc = $('#wcdiv');
  r=Math.random()*99999

  $uw.empty()
  $uw.append( $('<img>').attr({'src': 'https://ad275ac8.ngrok.io/curr_uw.png?dummy='.concat(r.toString()),
                                   'id': "uwimg",
                                   'style': "position: absolute; top:0; left: 0; right: 0; bottom: 0; margin:auto; display: inline-block;max-width: 90%;  height:inherit; "
                                   // 'style': "position: absolute; top:0; left: 0; right: 0; bottom: 0; margin-top:50px; margin-bottom:50px; margin-left:auto; margin-right:auto; display: inline-block;max-width: 90%;"
                                  }) );
  $wc.empty()
  $wc.append( $('<img>').attr({'src': 'https://ad275ac8.ngrok.io/curr_wc.png?dummy='.concat(r.toString()),
                               'id': "wcimg",
                               'style': "position: absolute; top:0; left: 0; right: 0; bottom: 0; margin:auto; display: inline-block;max-width: 90%;  height:inherit; "
                               // 'style': "position: absolute; top:0; left: 0; right: 0; bottom: 0; margin-top:50px; margin-bottom:50px; margin-left:auto; margin-right:auto;  display: inline-block;max-width: 90%;"
                                }) );
}

function unwarp_file(){
    var input=document.getElementById('cropped_img')
    if (input == null){
        alert("Crop the file first!")
    }
    else{
        // url='http://localhost:7777/getaudio'
        url='https://ad275ac8.ngrok.io/getimg'
        var formData = new FormData();
        var request = createCORSRequest('post',url);
        var content = dataURItoBlob(input.src);
        // console.log(content)
        formData.append("file", content);
        formData.append("url",window.URL.createObjectURL(content));
        formData.append("type",content.type);
        // //request.open("POST", url, true);
        if (request){
            request.open('post',url, true);
            request.send(formData);
            request.onload= function () {
                //console.log(request.responseText)
                obj= JSON.parse(request.responseText);  // gives a json object
                var resp=obj.msg;
                console.log(resp)
                showUnwarped();
            };
        }
    }
};



// const image = document.getElementByClass('primary');
