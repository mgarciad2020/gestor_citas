const LoginUtils = {
    login: (username, password) => {
        let errors = ""
        if (username == null || username == "")
            errors += "- Falta ingresar el DNI. <br />";

        if (password == null || password == "")
            errors += "- Falta ingresar la clave. <br />";

        if (errors != "") {
            MessageBox.Show("Faltan ingresar los siguientes campos: <br /><br />" + errors + "<br />Compruebe que todos los campos est&eacute;n completos y vuelva a intentarlo.", "Faltan datos", MessageBoxType.Critical);
            return;
        }

        MessageBox.ShowLoading("Comprobando credenciales, espere...", "Inciando sesi&oacute;n");

        $.ajax({
            url: API_URL + "/login",
            method: "POST",
            encType: "application/json",
            data: {
                "dni": username,
                "password": password
            },
            headers: {
                "Accept": "application/json"
            }
        })
        .then((result) => {
            Swal.close();

            //Get authorization result token
            let auth = result.authorization;

            //Set token as cookie
            Cookies.set("token", auth.token);

            //Redirect to DASHBOARD
            window.location = "./componentes/dashboard/";
        })
        .fail(() => {
            Swal.close();
            MessageBox.Show("Ha ocurrido un error al intentar iniciar sesi&oacute;n<br/> Compruebe si las credenciales son correctas y vuelve a intentarlo.", "Error", MessageBoxType.Critical);
        });

    },
    render: () => {
        $("#loginBtn").click(function (e) {
            LoginUtils.login($("#dniInput").val(), $("#claveInput").val());
        });
    }
};

const MessageBoxType = {
    Info: "info",
    Critical: "error",
    Warning: "warning",
    Question: "question",
    Success: "success"
};

const MessageBox = {
    Show: (message, title = "Warning", type = "info") => {
        Swal.fire(title, message, type);
    },
    ShowConfirmation: (action, message, title = "Are you sure?", type = "question", btnConfirmLabel = "S&iacute;", btnCancelLabel = "No") => {
        Swal.fire({
            title: title,
            text: message,
            icon: type,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: btnConfirmLabel,
            cancelButtonText: btnCancelLabel
        }).then((result) => {
            if (result.isConfirmed) {
                action();
            }
        })
    },
    ShowLoading: (text, title) => {
        Swal.fire({
            title: title,
            html: text,
            ShowConfirmation: false,
            didOpen: () => {
                Swal.showLoading()
            },
        });
    }
};

(function () {
    LoginUtils.render();
})();