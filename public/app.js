// Utilitaires d'affichage
function clearResult(id) {
  document.getElementById(id).innerHTML = '';
}
function showAlert(msg, type, id) {
  document.getElementById(id).innerHTML = `<div class='alert alert-${type} mt-3'>${msg}</div>`;
}

// REST, SOAP, GraphQL : gestion dynamique selon le mode
function getApiUrl(mode, endpoint) {
  if (mode === 'rest' || mode === 'graphql') return `http://localhost:3000${endpoint}`;
  if (mode === 'soap') return 'http://localhost:3000/soap/wsdl';
}

// Recherche station-service (Wilaya/Commune)
function rechercheStationService(mode) {
  const val = document.getElementById(`stationCode-recherche-${mode}`).value;
  const resultId = `${mode}Result-recherche`;
  clearResult(resultId);
  
  // Clear other mode results
  const otherModes = ['rest', 'soap', 'graphql'].filter(m => m !== mode);
  otherModes.forEach(m => {
    clearResult(`${m}Result-recherche`);
  });

  if (mode === 'rest') {
    fetch(getApiUrl(mode, `/api/recherche-station-service/${val}`))
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          if (data.message.includes('non trouvée')) {
            showAlert('Cette station n\'existe pas', 'warning', resultId);
          } else {
            showAlert(data.message, 'danger', resultId);
          }
        } else if (!data.lib_w || !data.lib_com || data.lib_w === 'undefined' || data.lib_com === 'undefined') {
          showAlert('Cette station n\'existe pas', 'warning', resultId);
        } else {
          document.getElementById(resultId).innerHTML = renderWilayaCommune(data);
        }
      })
      .catch(error => showAlert('Erreur: ' + error.message, 'danger', resultId));
  } else if (mode === 'graphql') {
    fetch(getApiUrl(mode, '/graphql'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `{ rechercheStationService(code_St: ${val}) { lib_w lib_com } }` })
    })
      .then(res => res.json())
      .then(data => {
        if (data.errors) {
          if (data.errors[0].message.includes('non trouvée')) {
            showAlert('Cette station n\'existe pas', 'warning', resultId);
          } else {
            showAlert(data.errors[0].message, 'danger', resultId);
          }
        } else if (!data.data.rechercheStationService) {
          showAlert('Cette station n\'existe pas', 'warning', resultId);
        } else {
          document.getElementById(resultId).innerHTML = renderWilayaCommune(data.data.rechercheStationService);
        }
      })
      .catch(error => showAlert('Erreur: ' + error.message, 'danger', resultId));
  } else if (mode === 'soap') {
    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:StationService">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:recherche_station_service><code_St>${val}</code_St></urn:recherche_station_service>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
    
    fetch(getApiUrl(mode), {
      method: 'POST',
      headers: { 
        'Content-Type': 'text/xml',
        'SOAPAction': 'recherche_station_service'
      },
      body: soapRequest
    })
    .then(response => response.text())
    .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      // Try to find the data in the SOAP body
      const body = xmlDoc.getElementsByTagName("soap:Body")[0] || xmlDoc.getElementsByTagName("soapenv:Body")[0];
      if (body) {
        // Look for the data in the response
        const responseNode = body.getElementsByTagName("tns:recherche_station_serviceResponse")[0];
        if (responseNode) {
          const lib_w = responseNode.getElementsByTagName("tns:lib_w")[0]?.textContent;
          const lib_com = responseNode.getElementsByTagName("tns:lib_com")[0]?.textContent;
          
          if (lib_w && lib_com) {
            document.getElementById(resultId).innerHTML = renderWilayaCommune({ lib_w, lib_com });
          } else {
            showAlert('Cette station n\'existe pas', 'warning', resultId);
          }
        } else {
          // Check for error message
          const errorNode = body.getElementsByTagName("error")[0];
          if (errorNode) {
            if (errorNode.textContent.includes('non trouvée')) {
              showAlert('Cette station n\'existe pas', 'warning', resultId);
            } else {
              showAlert(errorNode.textContent, 'danger', resultId);
            }
          } else {
            showAlert('Cette station n\'existe pas', 'warning', resultId);
          }
        }
      } else {
        showAlert('Erreur: Réponse SOAP invalide', 'danger', resultId);
      }
    })
    .catch(error => {
      console.error('SOAP Error:', error);
      showAlert('Erreur SOAP: ' + error.message, 'danger', resultId);
    });
  }
}

// Liste des services d'une station
function serviceStation(mode) {
  const val = document.getElementById(`stationCode-services-${mode}`).value;
  const resultId = `${mode}Result-services`;
  clearResult(resultId);
  if (mode === 'rest') {
    fetch(getApiUrl(mode, `/api/service-station/${val}`))
      .then(res => res.json())
      .then(data => {
        if (!data.length) showAlert('Aucun service trouvé pour cette station.', 'warning', resultId);
        else document.getElementById(resultId).innerHTML = renderServices(data);
      })
      .catch(error => showAlert('Erreur: ' + error.message, 'danger', resultId));
  } else if (mode === 'graphql') {
    fetch(getApiUrl(mode, '/graphql'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `{ serviceStation(code_St: ${val}) { code_ser lib_ser } }` })
    })
      .then(res => res.json())
      .then(data => {
        if (data.errors) showAlert(data.errors[0].message, 'danger', resultId);
        else document.getElementById(resultId).innerHTML = renderServices(data.data.serviceStation);
      })
      .catch(error => showAlert('Erreur: ' + error.message, 'danger', resultId));
  } else if (mode === 'soap') {
    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:StationService">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:service_station><code_St>${val}</code_St></urn:service_station>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
    
    fetch(getApiUrl(mode), {
      method: 'POST',
      headers: { 
        'Content-Type': 'text/xml',
        'SOAPAction': 'service_station'
      },
      body: soapRequest
    })
    .then(response => response.text())
    .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      // Try to find the data in the SOAP body
      const body = xmlDoc.getElementsByTagName("soap:Body")[0] || xmlDoc.getElementsByTagName("soapenv:Body")[0];
      if (body) {
        // Look for the services in the response
        const responseNode = body.getElementsByTagName("tns:service_stationResponse")[0];
        if (responseNode) {
          const servicesNode = responseNode.getElementsByTagName("tns:services")[0];
          if (servicesNode) {
            const services = servicesNode.getElementsByTagName("services");
        let data = [];
            
            for (let i = 0; i < services.length; i++) {
              const code_ser = services[i].getElementsByTagName("code_ser")[0]?.textContent;
              const lib_ser = services[i].getElementsByTagName("lib_ser")[0]?.textContent;
              
              if (code_ser && lib_ser) {
                data.push({ code_ser, lib_ser });
              }
            }
            
            if (data.length === 0) {
              showAlert('Aucun service trouvé pour cette station.', 'warning', resultId);
            } else {
              document.getElementById(resultId).innerHTML = renderServices(data);
            }
          } else {
            showAlert('Aucun service trouvé pour cette station.', 'warning', resultId);
          }
        } else {
          // Check for error message
          const errorNode = body.getElementsByTagName("error")[0];
          if (errorNode) {
            showAlert(errorNode.textContent, 'danger', resultId);
          } else {
            showAlert('Aucun service trouvé pour cette station.', 'warning', resultId);
          }
        }
      } else {
        showAlert('Erreur: Réponse SOAP invalide', 'danger', resultId);
      }
    })
    .catch(error => {
      console.error('SOAP Error:', error);
      showAlert('Erreur SOAP: ' + error.message, 'danger', resultId);
    });
  }
}

// Liste des services servis
function serviceServi(mode) {
  const val = document.getElementById(`stationCode-servi-${mode}`).value;
  const dateDebut = document.getElementById(`dateStart-servi-${mode}`).value;
  const dateFin = document.getElementById(`dateEnd-servi-${mode}`).value;
  const resultId = `${mode}Result-servi`;
  clearResult(resultId);
  if (mode === 'rest') {
    fetch(getApiUrl(mode, `/api/servi-station/${val}?date_debut=${dateDebut}&date_fin=${dateFin}`))
      .then(res => res.json())
      .then(data => {
        if (!data.length) showAlert('Aucun service servi pour cette station dans cette période.', 'warning', resultId);
        else document.getElementById(resultId).innerHTML = renderServicesServi(data);
      })
      .catch(error => showAlert('Erreur: ' + error.message, 'danger', resultId));
  } else if (mode === 'graphql') {
    fetch(getApiUrl(mode, '/graphql'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: `{ serviceServi(code_St: ${val}) { code_ser code_emp date_ser heure_ser } }` 
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.errors) showAlert(data.errors[0].message, 'danger', resultId);
        else document.getElementById(resultId).innerHTML = renderServicesServi(data.data.serviceServi);
      })
      .catch(error => showAlert('Erreur: ' + error.message, 'danger', resultId));
  } else if (mode === 'soap') {
    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:StationService">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:servi_station>
            <code_St>${val}</code_St>
            <date_debut>${dateDebut}</date_debut>
            <date_fin>${dateFin}</date_fin>
          </urn:servi_station>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
    
    fetch(getApiUrl(mode), {
      method: 'POST',
      headers: { 
        'Content-Type': 'text/xml',
        'SOAPAction': 'servi_station'
      },
      body: soapRequest
    })
    .then(response => response.text())
    .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      // Try to find the data in the SOAP body
      const body = xmlDoc.getElementsByTagName("soap:Body")[0] || xmlDoc.getElementsByTagName("soapenv:Body")[0];
      if (body) {
        // Look for the services in the response
        const responseNode = body.getElementsByTagName("tns:servi_stationResponse")[0];
        if (responseNode) {
          const servicesNode = responseNode.getElementsByTagName("tns:servicesServi")[0];
          if (servicesNode) {
            const services = servicesNode.getElementsByTagName("servicesServi");
        let data = [];
            
            for (let i = 0; i < services.length; i++) {
              const code_ser = services[i].getElementsByTagName("code_ser")[0]?.textContent;
              const code_emp = services[i].getElementsByTagName("code_emp")[0]?.textContent;
              const date_ser = services[i].getElementsByTagName("date_ser")[0]?.textContent;
              const heure_ser = services[i].getElementsByTagName("heure_ser")[0]?.textContent;
              
              if (code_ser && code_emp && date_ser && heure_ser) {
                data.push({ code_ser, code_emp, date_ser, heure_ser });
              }
            }
            
            if (data.length === 0) {
              showAlert('Aucun service servi trouvé pour cette station dans cette période.', 'warning', resultId);
            } else {
              document.getElementById(resultId).innerHTML = renderServicesServi(data);
            }
          } else {
            showAlert('Aucun service servi trouvé pour cette station dans cette période.', 'warning', resultId);
          }
        } else {
          // Check for error message
          const errorNode = body.getElementsByTagName("error")[0];
          if (errorNode) {
            showAlert(errorNode.textContent, 'danger', resultId);
          } else {
            showAlert('Aucun service servi trouvé pour cette station dans cette période.', 'warning', resultId);
          }
        }
      } else {
        showAlert('Erreur: Réponse SOAP invalide', 'danger', resultId);
      }
    })
    .catch(error => {
      console.error('SOAP Error:', error);
      showAlert('Erreur SOAP: ' + error.message, 'danger', resultId);
    });
  }
}

// Fonctions d'affichage (rendu HTML)
function renderWilayaCommune(data) {
  return `<div class='card result-card border-warning animate__animated animate__bounceIn' style='background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);'>
    <div class='card-body'>
      <h5 class='card-title text-warning'>Wilaya & Commune</h5>
      <p class='card-text'><span class='badge bg-warning text-dark'>Wilaya</span> ${data.lib_w}</p>
      <p class='card-text'><span class='badge bg-danger'>Commune</span> ${data.lib_com}</p>
    </div>
  </div>`;
}

function renderServices(data) {
  let html = `<div class='card result-card border-danger animate__animated animate__zoomIn' style='background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);'>
    <div class='card-body'>
      <h5 class='card-title text-danger'>Services existants</h5>
      <ul class='list-group list-group-flush'>`;
  data.forEach(s => { 
    html += `<li class='list-group-item'>
      <span class='badge bg-primary me-2'>${s.code_ser}</span> ${s.lib_ser}
    </li>`; 
  });
  html += '</ul></div></div>';
  return html;
}

function renderServicesServi(data) {
  let html = `<div class='card result-card border-info animate__animated animate__fadeInUp' style='background: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);'>
    <div class='card-body'>
      <h5 class='card-title text-info'>Services servis</h5>
      <div class='table-responsive'>
        <table class='table table-striped'>
          <thead>
            <tr>
              <th>Code Service</th>
              <th>Code Employé</th>
              <th>Date</th>
              <th>Heure</th>
            </tr>
          </thead>
          <tbody>`;
  data.forEach(s => { 
    html += `<tr>
      <td>${s.code_ser}</td>
      <td>${s.code_emp}</td>
      <td>${s.date_ser}</td>
      <td>${s.heure_ser}</td>
    </tr>`; 
  });
  html += '</tbody></table></div></div></div>';
  return html;
}
// Les autres fonctions (searchWebService, serviceServiPeriod) sont à ajouter selon les routes backend 