const AddEditSchedule = {
    FillForm: (scheduleItem) => {
        $("#idDNI").val(scheduleItem.dni);
        $("#idNames").val(scheduleItem.name);
        $("#idLastNames").val(scheduleItem.surnames);
        $("#IdTelephone").val(scheduleItem.phone);
        $("#idSubject").val(scheduleItem.comments);
        if (scheduleItem.date != "nomodify")
            $("#idDateTime").val(scheduleItem.date.toISOString().replaceAll("T", " ").replaceAll("Z", ""));
    },
    FillInteresteds: () => {
        MessageBox.ShowLoading("Cargando lista de interesados, espere por favor...", "Cargando");
        $.ajax({
            url: API_URL + "/interesteds",
            type: "GET",
            encType: "application/json",
            headers: {
              "Accept": "application/json"
            },
            beforeSend: function (request)
            {
              request.withCredentials = true;
              request.setRequestHeader("Authorization", "Bearer " + Cookies.get("token"));
            },
        }).then((interesteds) => {
                _.each(interesteds, (interested) => {
                    $("#existentPerson").append(`<option value="${interested.dni}">${interested.dni} - ${interested.nombres} ${interested.apellidos}</option>`);
                });

                //Listen for change event
                $("#existentPerson").on("change", (e) => {
                    let dni = $(e.currentTarget).val();
                    if (dni != "")
                    {
                        MessageBox.ShowLoading("Cargando interesado, espere por favor...", "Cargando");
                        $.ajax({
                            url: API_URL + "/interesteds/" + dni,
                            type: "GET",
                            encType: "application/json",
                            headers: {
                              "Accept": "application/json"
                            },
                            beforeSend: function (request)
                            {
                              request.withCredentials = true;
                              request.setRequestHeader("Authorization", "Bearer " + Cookies.get("token"));
                            },
                        }).then((result) => {

                            //Fill on form
                            AddEditSchedule.FillForm({
                                dni: result.dni,
                                name: result.nombres,
                                surnames: result.apellidos,
                                phone: result.telefono,
                                comments: $("#idSubject").val() != "" ? $("#idSubject").val() : "",
                                date: $("#idDateTime").val() != "" ? "nomodify" : new Date()
                            });

                            Swal.close();

                        });
                    }

                });

                Swal.close();
            });
    }
};
