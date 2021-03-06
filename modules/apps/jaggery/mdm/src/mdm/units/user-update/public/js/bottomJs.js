/**
 * Checks if provided input is valid against RegEx input.
 *
 * @param regExp Regular expression
 * @param inputString Input string to check
 * @returns {boolean} Returns true if input matches RegEx
 */
function inputIsValid(regExp, inputString) {
    return regExp.test(inputString);
}

/**
 * Checks if an email address has the valid format or not.
 *
 * @param email Email address
 * @returns {boolean} true if email has the valid format, otherwise false.
 */
function emailIsValid(email) {
    var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regExp.test(email);
}

$(document).ready(function () {
    $("select.select2[multiple=multiple]").select2({
        tags : true
    });

    /**
     * Following click function would execute
     * when a user clicks on "Add User" button
     * on Add User page in WSO2 MDM Console.
     */
    $("button#add-user-btn").click(function() {
        var username = $("input#username").val();
        var firstname = $("input#firstname").val();
        var lastname = $("input#lastname").val();
        var password = $("input#password").val();
        var emailAddress = $("input#emailAddress").val();
        var roles = $("select#roles").val();
        var errorMsgWrapper = "#user-create-error-msg";
        var errorMsg = "#user-create-error-msg span";
        if (!username) {
            $(errorMsg).text("Username is a required field. It cannot be empty.");
            $(errorMsgWrapper).removeClass("hidden");
        } else if (!inputIsValid(/^[^~?!#$:;%^*`+={}\[\]\\()|<>,'"" "A-Z]{3,30}$/, username)) {
            $(errorMsg).text("Provided username is invalid. Please check.");
            $(errorMsgWrapper).removeClass("hidden");
        } else if (password != "" && !inputIsValid(/^[\S]{5,30}$/, password)) {
            $(errorMsg).text("Provided password doesn't conform to the password policy. Please check.");
            $(errorMsgWrapper).removeClass("hidden");
        } else if (!firstname) {
            $(errorMsg).text("Firstname is a required field. It cannot be empty.");
            $(errorMsgWrapper).removeClass("hidden");
        } else if (!inputIsValid(/^[^~?!#$:;%^*`+={}\[\]\\()|<>,'"0-9]{1,30}$/, firstname)) {
            $(errorMsg).text("Provided firstname is invalid. Please check.");
            $(errorMsgWrapper).removeClass("hidden");
        } else if (!lastname) {
            $(errorMsg).text("Lastname is a required field. It cannot be empty.");
            $(errorMsgWrapper).removeClass("hidden");
        } else if (!inputIsValid(/^[^~?!#$:;%^*`+={}\[\]\\()|<>.,'"0-9]{1,30}$/, lastname)) {
            $(errorMsg).text("Provided lastname is invalid. Please check.");
            $(errorMsgWrapper).removeClass("hidden");
        } else if (!emailAddress) {
            $(errorMsg).text("Email is a required field. It cannot be empty.");
            $(errorMsgWrapper).removeClass("hidden");
        } else if (!emailIsValid(emailAddress)) {
            $(errorMsg).text("Provided email is invalid. Please check.");
            $(errorMsgWrapper).removeClass("hidden");
        } else {
            var addUserFormData = {};

            addUserFormData.username = username;
            addUserFormData.firstname = firstname;
            addUserFormData.lastname = lastname;
            addUserFormData.emailAddress = emailAddress;
            // Base64 encode the password
            //TODO: use CryptoJS for this
            addUserFormData.password = window.btoa(password);;
            addUserFormData.roles = roles;

            var addUserAPI = "/mdm-admin/users/" + username;

            invokerUtil.post(
                addUserAPI,
                addUserFormData,
                function (data) {
                    if (data["statusCode"] == 201) {
                        // Clearing user input fields.
                        $("input#username").val("");
                        $("input#firstname").val("");
                        $("input#lastname").val("");
                        $("input#email").val("");
                        $("input#password").val("");
                        $("select#roles").select2("val", "");
                        // Refreshing with success message
                        $("#user-create-form").addClass("hidden");
                        $("#user-created-msg").removeClass("hidden");
                    }
                }, function (data) {
                    if (data["status"] == 409) {
                        $(errorMsg).text("User : " + username + " doesn't exists. You cannot proceed.");
                    } else if (data["status"] == 500) {
                        $(errorMsg).text("An unexpected error occurred @ backend server. Please try again later.");
                    } else {
                        $(errorMsg).text("An unexpected error occurred. Please try again later.");
                    }
                    $(errorMsgWrapper).removeClass("hidden");
                }
            );
        }
    });
});