// Wait for the document to be fully loaded before executing the code
$(document).ready(function () {
  // Hide the image section, loader, and result elements initially
  hideElements();

  // Attach an event handler to the file input element
  $('#imageUpload').on('change', handleFileUpload);

  // Attach an event handler to the predict button
  $('#btn-predict').on('click', handlePrediction);

  // Function to hide the image section, loader, and result elements
  function hideElements() {
    $('.image-section, .loader, #result').hide();
  }

  // Function to handle the file upload
  function handleFileUpload(event) {
    // Get the input element that triggered the event
    const input = event.target;

    // Check if the input has files
    if (input.files && input.files[0]) {
      // Create a new FileReader to read the file
      const reader = new FileReader();

      // Attach an event handler to the FileReader's onload event
      reader.onload = function (e) {
        // Display the preview of the uploaded image
        displayPreview(e.target.result);
      };

      // Read the file as a data URL
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Function to display the preview of the uploaded image
  function displayPreview(imageUrl) {
    // Set the background image of the image preview element to the uploaded image URL
    $('#imagePreview').css('background-image', `url(${imageUrl})`);

    // Show the image section
    $('.image-section').show();

    // Show the predict button
    $('#btn-predict').show();
  }

  // Function to handle the prediction button click
  function handlePrediction() {
    // Create a new FormData object from the upload form
    const formData = new FormData($('#upload-file')[0]);

    // Show the loading animation and hide the predict button
    showLoadingAnimation();

    // Send an AJAX request to the '/predict' endpoint with the form data
    $.ajax({
      type: 'POST',
      url: '/predict',
      data: formData,
      contentType: false,
      processData: false,
      success: function (result) {
        // Display the result on the webpage
        displayResult(result);
      },
    });
  }

  // Function to show the loading animation and hide the predict button
  function showLoadingAnimation() {
    $('#btn-predict').hide();
    $('.loader').show();
  }

  // Function to display the result on the webpage
  function displayResult(result) {
    // Hide the loading animation
    $('.loader').hide();

    // Fade in the result element and set its text to the predicted result
    $('#result').fadeIn(600);
    $('#result').text(`Result: ${result}`);
  }
});

