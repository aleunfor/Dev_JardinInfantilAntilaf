$(function () {
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("form[name='formComunicado']").validate({
        // Specify validation rules
        ignore: [],
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            titulo: "required",
            subtitulo: "required",
            comunicado: {
                ckrequired: true
            },
            nivel_idnivel: "required"
        },
        // Specify validation error messages
        messages: {
            titulo: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Titulo!</div>",
            subtitulo: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Subtitulo! </div>",
            comunicado: {
                ckrequired: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Contenido!</div>"
            },
            nivel_idnivel: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese un Nivel</div>"
            /*password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            }*/
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });
});