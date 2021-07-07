$(function () {
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("form[name='formAddKid']").validate({
        // Specify validation rules
        ignore: [],
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            rut: "required",
            nombre: "required",
            apellido: "required",
            edad: {
                required: true,
                minlength: 1
            },
            fecha_nac: "required",
            sexo: "required",
            nivel_idnivel: "required"
        },
        // Specify validation error messages
        messages: {
            rut: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese RUT! </div>",
            nombre: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Nombre! </div>",
            apellido: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Apellido ! </div>",
            edad: {
                required: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Edad! </div>",
                minlength: "<div class='alert alert-warning w-100' role='alert'>Ingrese edad correcta! </div>"
            },
            fecha_nac: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Fecha de Nacimiento </div>",
            sexo: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Sexo! </div>",
            nivel_idnivel: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Nivel! </div>"

        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

    $("input#rut").rut().on('rutInvalido', function (e) {
        $("#addKid").attr("disabled", true);
    });

    $("input#rut").rut().on('rutValido', function (e) {
        $("#addKid").attr("disabled", false);
    });


});
