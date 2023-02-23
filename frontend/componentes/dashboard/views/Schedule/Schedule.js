const rowModel = "<tr>" +
    "<td>%1</td>" +
    "<td>%2</td>" +
    "<td>%3</td>" +
    "<td>%4</td>" +
    "<td>%5</td>" +
    "<td><button class=\"btn btn-primary\" onClick=\"Schedule.editItem(%id)\"><i class=\"icon-pencil\"></i></btn></td>" +
    "<td><button class=\"btn btn-danger\" onClick=\"Schedule.deleteItem(%id)\"><i class=\"icon-trash\"></i></btn></td>" +
    "</tr>";

//Last added ID to get
let lastAddedId = 0;

const Schedule = {
    elements: {},
    dates: [],
    pages: {
        current: 0,
        total: 0
    },
    workers: ["employee1", "employee2", "employee3"],
    randomWorker: function () {
        return Schedule.workers[Math.floor(Math.random() * Schedule.workers.length)];
    },
    editItem: (id) => {
        $.get("views/AddEditSchedule/AddEditSchedule.html")
            .then((content) => {
                Main.createDialog(Schedule.elements.addEditModal, "Editar evento #" + id, content, () => {
                    let errors = [];

                    let formData = {
                        dni: $("#idDNI").val(),
                        names: $("#idNames").val(),
                        lastnames: $("#idLastNames").val(),
                        telephone: $("#IdTelephone").val(),
                        dateTime: $("#idDateTime").val(),
                        comments: $("#idSubject").val()
                    };

                    if (formData.dni == "")
                        errors.push("El campo <b>DNI</b> est&aacute; vac&iacute;o");
                    if (formData.names == "")
                        errors.push("El campo <b>NOMBRES</b> est&aacute; vac&iacute;o");
                    if (formData.lastnames == "")
                        errors.push("El campo <b>APELLIDOS</b> est&aacute; vac&iacute;o");
                    if (formData.telephone == "")
                        errors.push("El campo <b>TELEFONO</b> est&aacute; vac&iacute;o");
                    if (formData.telephone != "" && (isNaN(formData.telephone) || formData.telephone.length != 9))
                        errors.push("El campo <b>TELEFONO</b> no tiene el formato correcto.");
                    if (formData.dateTime == "")
                        errors.push("El campo <b>FECHA Y HORA</b> est&aacute; vac&iacute;o");
                    /*if (formData.comments == "")
                        errors.push("El campo <b>COMENTARIOS</b> est&aacute; vac&iacute;o");*/

                    if (errors.length > 0) {
                        let errorMsg = "Han ocurrido los siguientes errores:<br /><br />"
                        errors.forEach((error) => {
                            errorMsg += "- " + error + "<br />";
                        });
                        errorMsg += "<br />Corr&iacute;jalos antes de volver a enviar.";

                        MessageBox.Show(errorMsg, "Error", MessageBoxType.Critical);
                        return false;
                    }

                    //Save it
                    $.ajax({
                        url: API_URL + "/events/" + id + "/edit",
                        method: "POST",
                        encType: "application/json",
                        data: { data: formData },
                        headers: {
                            "Accept": "application/json",
                        },
                        beforeSend: function (request)
                        {
                            request.withCredentials = true;
                            request.setRequestHeader("Authorization", "Bearer " + Cookies.get("token"));
                        },
                    }).then((result) => {
                        //Reload data
                        Schedule.elements.data_element.html("");
                        Schedule.readData();

                        return true;
                    });

                    return true;
                }, () => {
                    //Fill interesteds list
                    AddEditSchedule.FillInteresteds();
                    AddEditSchedule.FillForm(Schedule.dates[id]);
                });
            });
    },
    deleteItem: (id) => {
        MessageBox.ShowConfirmation(() => {
            //Delete it
            $.ajax({
                url: API_URL + "/events/" + id + "/delete",
                method: "POST",
                encType: "application/json",
                headers: {
                    "Accept": "application/json",
                },
                beforeSend: function (request)
                {
                    request.withCredentials = true;
                    request.setRequestHeader("Authorization", "Bearer " + Cookies.get("token"));
                },
            }).then((result) => {
                if (!result.success)
                    MessageBox.Show(result.message, "Error", MessageBoxType.Critical);

                //Read info again
                Schedule.elements.data_element.html("");
                Schedule.readData();
            });
        }, "Esta accion es irreversible!", "Est&aacute; seguro?", MessageBoxType.Warning);
    },
    updatePagination: () => {
        let finalPagination = "";
        for (var i = 1; i <= Schedule.pages.total; i++) {
            let active = i == Schedule.pages.current ? "active" : "";
            finalPagination += `<li class="page-item ${active}"><a class="page-link" onClick="Schedule.readData(${i})">${i}</a></li>`;
        }

        Schedule.elements.eventPagination.html(finalPagination);
    },
    readData: (page = 1, filterDates = null, employee = null) => {
        Schedule.dates = [];
        let tableRows = "";

        let filterQuery = filterDates != null || employee != null ? {
            filter: {
                dates: filterDates,
                owner: employee
            }
        } : null;

        //TODO: apply filter
        //Load events
        MessageBox.ShowLoading("Cargando eventos, espere por favor...", "Cargando");
        $.ajax({
            url: API_URL + "/events/" + page,
            method: "GET",
            data: filterQuery,
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

            //Update pagination
            let events = result.result;
            Schedule.pages = result.pages;

            Schedule.updatePagination();

            //Add content
            _.each(events, (event) => {
                Schedule.dates[event.id] = {
                    id: event.id,
                    dni: event.dni_interesado != "" ? event.dni_interesado.substr(0, event.dni_interesado.length - 1) + '-' + event.dni_interesado[event.dni_interesado.length - 1] : "",
                    name: null,
                    surnames: null,
                    phone: null,
                    comments: event.observaciones,
                    date: new Date(event.fecha_evento),
                    worker: event.dni_empleado_registro,
                }

                if (event.interested != null) {
                    Schedule.dates[event.id].name = event.interested.nombres;
                    Schedule.dates[event.id].surnames = event.interested.apellidos;
                    Schedule.dates[event.id].phone = event.interested.telefono;
                }
            });

            Schedule.dates.forEach((element) => {
                //Shallow copy
                let tableElement = JSON.parse(JSON.stringify(rowModel))
                    .replaceAll("%id", element.id)
                    .replaceAll("%1", element.dni)
                    .replaceAll("%2", element.name + " " + element.surnames)
                    .replaceAll("%3", "(" + element.phone.substring(0, 3) + ") " + element.phone.substring(3, 5) + " " + element.phone.substring(5, 7) + " " + element.phone.substring(7, 9))
                    .replaceAll("%4", element.comments != null ? element.comments : "")
                    .replaceAll("%5", element.date.toLocaleString());

                tableRows += tableElement;
            });

            //Get last added id to count new item
            lastAddedId = Schedule.dates.length > 0 ? Schedule.dates[Schedule.dates.length - 1].id : 0;

            //Print data to table
            Schedule.elements.data_element.html(tableRows);
            
            Swal.close();
        });


    },
    render: () => {
        //Recall elements
        Schedule.elements = {
            data_element: $("#tableData"),
            newElement: $("#newElement"),
            employeesCombo: $("#filterByEmployee"),
            filterByEmployee: $("#filterByEmployee"),
            filterDateFrom: $("#filterDateFrom"),
            filterDateTo: $("#filterDateTo"),
            filterDatesButton: $("#filterDatesButton"),
            addEditModal: $("#addEditModal"),
            exportPdfButton: $("#exportPDF"),
            eventPagination: $("#eventPagination")
        };

        //Load employees
        MessageBox.ShowLoading("Cargando empleados, espere por favor...", "Cargando");
        $.ajax({
            url: API_URL + "/employees",
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
        }).then((employees) => {
            _.each(employees, (employee) => {
                let tplOption = `<option value=${employee.dni}>${employee.nombres} ${employee.apellidos}</option>`;
                Schedule.elements.employeesCombo.append(tplOption);
            });

            Swal.close();
        });

        //Read new data
        Schedule.readData();

        Schedule.elements.newElement.click((evt) => {
            $.get("views/AddEditSchedule/AddEditSchedule.html")
                .then((content) => {
                    Main.createDialog(Schedule.elements.addEditModal, "Nuevo evento", content, () => {
                        let errors = [];

                        let formData = {
                            dni: $("#idDNI").val(),
                            names: $("#idNames").val(),
                            lastnames: $("#idLastNames").val(),
                            telephone: $("#IdTelephone").val(),
                            dateTime: $("#idDateTime").val(),
                            comments: $("#idSubject").val()
                        };

                        if (formData.dni == "")
                            errors.push("El campo <b>DNI</b> est&aacute; vac&iacute;o");
                        if (formData.names == "")
                            errors.push("El campo <b>NOMBRES</b> est&aacute; vac&iacute;o");
                        if (formData.lastnames == "")
                            errors.push("El campo <b>APELLIDOS</b> est&aacute; vac&iacute;o");
                        if (formData.telephone == "")
                            errors.push("El campo <b>TELEFONO</b> est&aacute; vac&iacute;o");
                        if (formData.telephone != "" && (isNaN(formData.telephone) || formData.telephone.length != 9))
                            errors.push("El campo <b>TELEFONO</b> no tiene el formato correcto.");
                        if (formData.dateTime == "")
                            errors.push("El campo <b>FECHA Y HORA</b> est&aacute; vac&iacute;o");
                        /*if (formData.comments == "")
                            errors.push("El campo <b>COMENTARIOS</b> est&aacute; vac&iacute;o");*/

                        if (errors.length > 0) {
                            let errorMsg = "Han ocurrido los siguientes errores:<br /><br />"
                            errors.forEach((error) => {
                                errorMsg += "- " + error + "<br />";
                            });
                            errorMsg += "<br />Corr&iacute;jalos antes de volver a enviar.";

                            MessageBox.Show(errorMsg, "Error", MessageBoxType.Critical);
                            return false;
                        }

                        //Save it
                        $.ajax({
                            url: API_URL + "/events",
                            method: "POST",
                            data: {data: formData},
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
                            Schedule.readData();
                            return true;
                        });

                        return true;
                    }, () => {
                        //Fill interesteds list
                        AddEditSchedule.FillInteresteds();
                    });
                });

        });

        Schedule.elements.filterDatesButton.click((evt) => {
            let dateFrom = Schedule.elements.filterDateFrom.val();
            let dateTo = Schedule.elements.filterDateTo.val();
            let employee = Schedule.elements.filterByEmployee.val();

            Schedule.readData(Schedule.pages.current, (dateFrom == null || dateFrom == "") || (dateTo == null || dateTo == "") ? null : {
                dateFrom: moment(dateFrom + " 00:00:00").toISOString(),
                dateTo: moment(dateTo + " 23:59:59").toISOString()
            }, employee != "" ? employee : null);
        });

        Schedule.elements.exportPdfButton.click((evt) => {
            let pdf = jspdf.jsPDF();
            pdf.autoTable({ html: '#schedule_table' })
            pdf.save("export_" + new Date().toLocaleString().replaceAll(" ", "").replaceAll("/", "_").replaceAll(",", "_").replaceAll(":", "_") + ".pdf");
        });

    }
};