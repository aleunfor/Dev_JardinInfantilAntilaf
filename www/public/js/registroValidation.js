$(function () {
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $("form[name='formRegistro']").validate({
        // Specify validation rules
        ignore: [],
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            rut: "required",
            nombre: {
                required: true,
                maxlength: 45
            },
            apellido: {
                required: true,
                maxlength: 45
            },
            fecha_nac: "required",
            direccion: {
                required: true,
                maxlength: 100
            },
            telefono: {
                required: true,
                minlength: 9,
                number: true
            },
            username: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 8
            }
        },
        // Specify validation error messages
        messages: {
            rut: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese RUT! </div>",
            nombre: {
                required: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Nombre! </div>",
                maxlength: "<div class='alert alert-warning w-100' role='alert'>Máximo 45 carácteres! </div>"
            },
            apellido: {
                required: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Apellido! </div>",
                maxlength: "<div class='alert alert-warning w-100' role='alert'>Máximo 45 carácteres! </div>"
            },
            fecha_nac: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Fecha de Nacimiento !</div>",
            direccion: {
                required: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Dirección! </div>",
                maxlength: "<div class='alert alert-warning w-100' role='alert'>Máximo 100 carácteres! </div>"
            },
            telefono: {
                required: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Teléfono! </div>",
                minlength: "<div class='alert alert-warning w-100' role='alert'>Ingrese 9 números! </div>",
                number: "<div class='alert alert-warning w-100' role='alert'>Ingrese número válido! </div>"
            },
            username: {
                required: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Email ! </div>",
                email: "<div class='alert alert-warning w-100' role='alert'>Ingrese Email Válido ! </div>"
            },
            password: {
                required: "<div class='alert alert-warning w-100' role='alert'>Porfavor Ingrese Contraseña ! </div>",
                minlength: "<div class='alert alert-warning w-100' role='alert'>Mínimo de 8 Carácteres ! </div>"
            }
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

    $("input#rut").rut().on('rutInvalido', function(e) {
        $("#registrar").attr("disabled", true);
    });

    $("input#rut").rut().on('rutValido', function(e) {
        $("#registrar").attr("disabled", false);
    });
    

});



    

