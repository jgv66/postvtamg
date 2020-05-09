module.exports = {
    // cada funncion se separa por comas  
    Login: function(sql, body) {
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
        const fcomprm = (body.fcompromiso === undefined) ? 'NULL' : "'" + body.fcompromiso.toString() + "'";
        const fcumpli = (body.fcumplimiento === undefined) ? 'NULL' : "'" + body.fcumplimiento.toString() + "'";
        //
        console.log('nuevaTarea.req.body', body);
        //
        query = "exec ksp_registro_insert '" + body.codigousr + "','" + body.empresa + "','" + body.sector + "','" + body.zona + "',";
        query += "'" + body.clasificacion + "','" + body.descripcion_nc + "','" + body.solicitud + "'," + body.presupuesto.toString() + ",'" + body.responsable + "',";
        query += fcomprm + ",'" + body.prevencionista + "'," + fcumpli + " ; ";
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
    saveIMG: function(sql, imagenes, id) {
        //  
        var query = 'insert into registros_img (idregistro,tipo,imagen_ext,imagen_b64) values ';
        //
        const l = imagenes.length - 1;
        var i = 0;
        imagenes.forEach(imagen => {
            console.log(imagen.img.length);
            query += "( " + id.toString() + ",'I','JPG','" + imagen.img + "')" + (i < l ? ',' : '');
            ++i;
        });
        // console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                // console.log(resultado);
                return resultado.recordset;
            })
            .then(resultado => {
                // console.log(resultado);
                // if (resultado) {
                return { resultado: 'ok', datos: resultado };
                // } else {
                //     return { resultado: 'error', datos: resultado };
                // }
            })
            .catch(err => {
                console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    //
    consultaID: function(sql, body) {
        //
        console.log(body);
        const query = "exec ksp_rescataid '" +
            body.codigousr + "'," +
            body.empresa + "," +
            body.id.toString() + ",'" +
            (body.responsable === undefined ? '' : body.responsable) + "','" +
            (body.experto === undefined ? '' : body.experto) + "' ;";
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
    cerrarID: function(sql, body) {
        //
        console.log(body);
        const query = "exec ksp_cierraid '" +
            body.codigousr + "'," +
            body.empresa + "," +
            body.id.toString() + ",'" +
            body.fechacierre + "','" +
            body.observacion + "','" +
            body.responsable + "','" +
            body.experto + "' ;";
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
    getImages: function(sql, body) {
        //  
        const query = "exec ksp_getimages " + body.id.toString() + " ;";
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                // console.log(JSON.stringify(resultado));
                if (resultado) {
                    return { resultado: 'ok', datos: JSON.stringify(resultado) };
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