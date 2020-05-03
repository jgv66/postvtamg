module.exports = {

    // cada funncion se separa por comas  
    postUsr: function(sql, body) {
        //  
        const query = "exec ksp_usuarios '" + body.rutcorreo + "','" + body.clave + "' ;";
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                if (resultado) {
                    return { resultado: 'ok', datos: resultado };
                } else {
                    return { resultado: 'error', datos: resultado };
                }
            })
            .catch(err => {
                console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    //
    obtenTablas: function(sql, body) {
        //  
        let query = '';
        if (body.tabla == 'sectores') {
            query = "select sector,descripcion from sectores order by sector ; ";
        } else if (body.tabla == 'zonas') {
            query = "select zona,descripcion from zonas order by zona ; ";
        } else if (body.tabla == 'cargos') {
            query = "select cargo,descripcion from cargos order by cargo; ";
        } else if (body.tabla == 'usuarios') {
            query = "select codigousr, nombre from usuarios order by codigousr; ";
        }
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                if (resultado) {
                    return { resultado: 'ok', datos: resultado };
                } else {
                    return { resultado: 'error', datos: resultado };
                }
            })
            .catch(err => {
                console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    //   
    misTareas: function(sql, body) {
        // los parametros
        var offset = body.offset || '0';
        var usuario = body.usuario || '';
        var empresa = body.empresa || '1';
        var contar = body.contar || '';
        var enviados = body.enviados || '';
        var cerradas = body.cerradas || '';
        var query = '';
        //
        console.log(body);
        //
        if (cerradas == 'C') {
            query = "exec ksp_miscerradas " + offset + ",'" + usuario + "'," + empresa + " ;";
        } else if (contar == 'contar') {
            if (enviados == 'enviados') {
                query = "exec ksp_mispendientes_count '" + usuario + "'," + empresa + " ;";
            } else {
                query = "exec ksp_misrecibidos_count  '" + usuario + "'," + empresa + " ;";
            }
        } else {
            if (enviados == 'enviados') {
                query = "exec ksp_mispendientes " + offset + ",'" + usuario + "'," + empresa + " ;";
            } else {
                query = "exec sp_misrecibidos  " + offset + ",'" + usuario + "'," + empresa + " ;";
            }
        }
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                if (resultado) {
                    return { resultado: 'ok', datos: resultado };
                } else {
                    return { resultado: 'error', datos: resultado };
                }
            })
            .catch(err => {
                console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    //
    nuevaTarea: function(sql, body) {
        //  
        var query = '';
        var data = body.data;
        //
        console.log('req.body', data);
        //
        query = "exec ksp_registro_insert '" + data.codigousr + "','" + data.empresa + "','" + data.sector + "','" + data.zona + "',getdate(),";
        query += "'" + data.clasificacion + "','" + data.descripcion_nc.trim() + "','" + data.solicitud.trim() + "'," + data.presupuesto + ",'" + data.responsable + "',";
        query += "'" + data.fcompromiso + "','" + data.prevencionista + "','" + data.fcumplimiento + "' ; ";
        //
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                if (resultado) {
                    return { resultado: 'ok', datos: resultado };
                } else {
                    return { resultado: 'error', datos: resultado };
                }
            })
            .catch(err => {
                console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    //
};