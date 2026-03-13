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