//Extention method for check CKEditor Control   
// jQuery.validator.addMethod("customfunctionanme",validationfunction,validationmessage);  
  
jQuery.validator.addMethod("ckrequired", function (value, element) {  
    var idname = $(element).attr('id');  
    var editor = CKEDITOR.instances[idname];  
    var ckValue = GetTextFromHtml(editor.getData()).replace(/<[^>]*>/gi, '').trim();  
    if (ckValue.length === 0) {  
//if empty or trimmed value then remove extra spacing to current control  
        $(element).val(ckValue);  
    } else {  
//If not empty then leave the value as it is  
        $(element).val(editor.getData());  
    }  
    return $(element).val().length > 0;  
}, "This field is required");  

function GetTextFromHtml(html) {  
    var dv = document.createElement("DIV");  
    dv.innerHTML = html;  
    return dv.textContent || dv.innerText || "";  
} 