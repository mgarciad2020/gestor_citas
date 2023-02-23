//Everything starts here

const modalTemplate = `
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">{title}</h5>
                <button type="button" class="close closeDialog">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                {content}
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-primary saveDialog">Guardar cambios</button>
                <button type="button" class="btn btn-secondary closeDialog">Descartar</button>
            </div>
        </div>
    </div>
`;


//Global reaching
const Main = {
    routes: {

    },
    elements: {
        dashboard: $(".dashboard"),
        loggedDni: $("#loggedDni"),
        loggedName: $("#loggedName"),
        sidebarLinks: $(".sidebar-nav-button"),
        showBoard: $("#showBoard"),
        hideBoard: $("#hideBoard"),
        pageContent: $(".pageContent"),
    },
    showDashboard: () => {
        Main.elements.dashboard.animate({ left: "0px" });
        Main.elements.dashboard.show();
    },
    hideDashboard: () => {
        Main.elements.dashboard.animate({ left: "-300px" });
        setTimeout(() => {
            Main.elements.dashboard.hide();
        }, 500);
    },
    navigateTo: (location) => {
        //First, check if user is logged in
        $.ajax({
            url: API_URL + "/me",
            method: "GET",
            encType: "application/json",
            headers: {
                "Accept": "application/json",
            },
            beforeSend: function (request) {
                request.withCredentials = true;
                request.setRequestHeader("Authorization", "Bearer " + Cookies.get("token"));
            },
        })
            .then((result) => {

                let user = result.user;
                //Set logged info
                Main.elements.loggedDni.html(user.dni);
                Main.elements.loggedName.html(user.nombres + ' ' + user.apellidos);

                Cookies.set("navigation", JSON.stringify({ location: location }));

                switch (location) {
                    case "main":
                        Main.elements.pageContent.html("");
                        $.get("views/Main/Main.html")
                            .then((content) => {
                                Main.elements.pageContent.html(content);
                                Schedule.render();
                            });
                        break;
                    case "agenda":
                        Main.elements.pageContent.html("");
                        $.get("views/Schedule/Schedule.html")
                            .then((content) => {
                                Main.elements.pageContent.html(content);
                                Schedule.render();
                            });
                        break;
                    case "logout":
                        MessageBox.ShowLoading("Hasta la pr&oacute;xima!", "Cerrando sesi&oacute;n");
                        $.ajax({
                            url: API_URL + "/logout",
                            method: "POST",
                            encType: "application/json",
                            headers: {
                                "Accept": "application/json",
                            },
                            beforeSend: function (request) {
                                request.withCredentials = true;
                                request.setRequestHeader("Authorization", "Bearer " + Cookies.get("token"));
                            },
                        })
                            .then((result) => {
                                Swal.close();

                                Cookies.set("navigation", "");
                                //redirect to login
                                window.location = "../../";
                            });
                        break;

                    default:
                        alert("Pagina desconocida");
                        break;
                }
            })
            .fail((errorResponse) => {
                let error = errorResponse.responseJSON.message;
                if (error == "Unauthorized!") {
                    //redirect to login
                    window.location = "../../";
                }
            });


    },
    createDialog: (container, title, content, onSave, preExec = null) => {
        let modalContent = JSON.parse(JSON.stringify(modalTemplate))
            .replaceAll("{title}", title)
            .replaceAll("{content}", content);
        container.html(modalContent);

        $(".saveDialog").click((evt) => {
            let success = onSave();
            if (success) {
                container.modal('hide');
                $(".closeDialog").unbind();
                $(".saveDialog").unbind();
            }

            //In case of error
            evt.preventDefault();
        });

        $(".closeDialog").click(() => {
            container.modal('hide');
            $(".closeDialog").unbind();
            $(".saveDialog").unbind();
        });

        container.modal('show');

        if (preExec != null)
            preExec();

    },
    render: () => {
        Main.elements.dashboard.hide();
        Main.elements.showBoard.click((evt) => {
            Main.showDashboard();
        });

        Main.elements.hideBoard.click((evt) => {
            Main.hideDashboard();
        });

        //When click on sidebar nav button
        Main.elements.sidebarLinks.click((evt) => {
            let navClicked = $(evt.currentTarget).attr("to");
            Main.hideDashboard();
            Main.navigateTo(navClicked);
        });


        if (Cookies.get("navigation") == null || Cookies.get("navigation") == "") {
            //Navigate to default page
            Main.navigateTo("main");
            return;
        }

        //Navigate to selected page
        Main.navigateTo(JSON.parse(Cookies.get("navigation")).location);


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
    Main.render();
})();