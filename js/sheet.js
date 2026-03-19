let empresas = [];

async function getStates() {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1p8yW4LQUdVTPYA5Nd7vkg5m5X96HTBTwI_Exy-gw7fo',
            range: 'States!A2:J',
        });
    } catch (err) {
        document.getElementById('content').innerText = "Error API: " + err.message;
        return;
    }

    const range = response.result;
    if (!range || !range.values || range.values.length === 0) {
        document.getElementById('content').innerText = 'No se encontraron datos.';
        return;
    }

    empresas = [];
    let textoParaMostrar = "Empresas encontradas:\n\n";

    range.values.forEach((fila) => {
        // Validación: Ignorar si la primera celda no es número o si la fila está vacía
        if (!fila[0] || isNaN(parseInt(fila[0]))) return;

        const nuevaEmpresa = {
            id: fila[0],
            numEstado: fila[1] || "",
            estado: fila[2] || "",
            region: fila[3] || "",
            sector: fila[4] || "",
            compania: fila[5] || "",
            empleados: fila[6] || "",
            graduados: fila[7] || "",
            aprobacion: fila[8] || "",
            notas: fila[9] || ""
        };
        empresas.push(nuevaEmpresa);
        
        // Construimos el texto para el <pre id="content">
        textoParaMostrar += `- ${nuevaEmpresa.compania} (${nuevaEmpresa.estado})\n`;
    });

    // ACTUALIZAR EL HTML
    document.getElementById('content').innerText = textoParaMostrar;
    console.log("Array de empresas:", empresas);
}

async function editEmpresas(contenido) {
    const update = [
        contenido.id,
        contenido.numEstado,
        contenido.estado,
        contenido.region,
        contenido.compania,
        contenido.empleados,
        contenido.graduados,
        contenido.aprobacion,
        new Date().toISOString(),
        contenido.notas
    ]
    const editRow = parseInt(id)+1;
    const response = await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET,
        range: `${hoja}!A${editRow}:G${editRow}`,
        values: [update],
        valueInputOption: "USER_ENTERED"
    });
    return response;
}

//Añade un objeto al final de la hoja de calculo
async function crearEmpresa(datos) {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: '1p8yW4LQUdVTPYA5Nd7vkg5m5X96HTBTwI_Exy-gw7fo',
        range: 'States!A2', // Google buscará la última fila vacía a partir de aquí
        valueInputOption: 'USER_ENTERED', // Interpreta fechas y números automáticamente
        resource: {
          values: [[
            datos.id, datos.numEstado, datos.estado, datos.region,
            datos.sector, datos.compania, datos.empleados,
            datos.graduados, datos.aprobacion, datos.notas
          ]]
        },
      });
      console.log('Fila añadida:', response.result);
      alert('Empresa agregada con éxito');
      await getStates(); // Recargar la lista
    } catch (err) {
      console.error('Error al agregar nueva empresa:', err);
    }
  }
  
  async function editarEmpresa(id, nuevosDatos) {
    // Calculo del rango basado en el ID (asumiendo que el ID 1 está en la fila 2)
    const filaAEditar = parseInt(id) + 1; 
    const rango = `States!A${filaAEditar}:J${filaAEditar}`;
  
    try {
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: '1p8yW4LQUdVTPYA5Nd7vkg5m5X96HTBTwI_Exy-gw7fo',
        range: rango,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[
            nuevosDatos.id, nuevosDatos.numEstado, nuevosDatos.estado, 
            nuevosDatos.region, nuevosDatos.sector, nuevosDatos.compania, 
            nuevosDatos.empleados, nuevosDatos.graduados, 
            nuevosDatos.aprobacion, nuevosDatos.notas
          ]]
        },
      });
      alert('Fila actualizada');
      await getStates(); 
    } catch (err) {
      console.error('Error al editar:', err);
    }
  }

  function ejecutarCrear() {
    const datos = {
      id: Date.now().toString().slice(-5), // ID temporal basado en tiempo
      numEstado: "1",
      estado: document.getElementById('comp_estado').value,
      region: "Norte",
      sector: "Tecnología",
      compania: document.getElementById('comp_name').value,
      empleados: "10",
      graduados: "5",
      aprobacion: "Si",
      notas: ""
    };
    crearEmpresa(datos);
  }
  