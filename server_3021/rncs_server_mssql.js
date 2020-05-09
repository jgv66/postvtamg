// console.log("hola mundo");
var express = require('express');
var cors = require('cors');
var app = express();
//
var dbconex = require('./rncs_conexion_mssql.js');
var consultas = require('./rncs_consultas.js');
var async = require("async");
// imagenes 
// var _ttoImg = require('./rncs_img.js');
var path = require('path');

//-------------------------------------------------
// Habilitacion de cors (sacada de https://github.com/jsanta/api-starter/blob/develop/index.js )
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Token', 'X-RefreshToken'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
//
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb', extended: true })); //app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); //app.use(bodyParser.urlencoded({ extended: false }));

// envio de correos 
var nodemailer = require('nodemailer'); // email sender function 
exports.sendEmail = function(req, res) { console.log('enviando correo...'); };

// carpeta de imagenes: desde donde se levanta el servidor es esta ruta -> /root/trial-server-001/public
app.use("/public", express.static('public'));
// carpeta de imagenes: desde donde se levanta el servidor es esta ruta -> /root/trial-server-001/public
app.use(express.static('./public'));
publicpath = path.resolve(__dirname, 'public');
CARPETA_IMGS = publicpath + '/images/';
CARPETA_XLSX = publicpath + '/xls/';
// console.log(CARPETA_IMGS, CARPETA_XLSX );

// servidor escuchando puerto 3021
var server = app.listen(3021, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Escuchando http en el puerto: %s", port)
});

// dejare el server mssql siempre activo
var sql = require('mssql');
var conex = sql.connect(dbconex);

//-------------------------------------------------
app.post('/login', function(req, res) {
    //
    consultas.Login(sql, req.body)
        .then(function(data) {
            //
            // console.log(data);
            if (data.resultado === 'ok') {
                res.json({ resultado: 'ok', datos: data.datos });
            } else {
                res.json({ resultado: 'error', datos: 'Usuario/Clave no coinciden o no existe usuario. Corrija y reintente.' });
            }
        })
        .catch(function(err) {
            console.log("/login ", err);
            res.json({ resultado: 'error', datos: 'Usuario no existe. Corrija o verifique, luego reintente.' });
        });
});

app.post('/obtentablas', function(req, res) {
    //
    consultas.obtenTablas(sql, req.body)
        .then(function(data) {
            //
            // console.log(data);
            if (data.resultado === 'ok') {
                //
                res.json({ resultado: 'ok', datos: data.datos });
            } else {
                res.json({ resultado: 'error', datos: data.mensaje });
            }
        })
        .catch(function(err) {
            console.log("/obtentablas ", err);
            res.json({ resultado: 'error', datos: err });
        });
});

app.post('/mistareas', function(req, res) {
    //
    consultas.misTareas(sql, req.body)
        .then(function(data) {
            //
            // console.log(data);
            if (data.resultado === 'ok') {
                //
                res.json({ resultado: 'ok', datos: data.datos });
            } else {
                res.json({ resultado: 'error', datos: data.mensaje });
            }
        })
        .catch(function(err) {
            console.log("/mistareas ", err);
            res.json({ resultado: 'error', datos: err });
        });
});

app.post('/nuevatarea', function(req, res) {
    //
    // console.log(req.body);
    const imagenes = (req.body.imagenes === undefined) ? undefined : JSON.parse(req.body.imagenes);
    // console.log(imagenes);
    //
    consultas.nuevaTarea(sql, req.body.data)
        .then(function(data) {
            //
            // console.log(data);
            if (data.resultado === 'ok') {
                //
                if (imagenes === undefined) {
                    res.json({ resultado: 'ok', datos: data.datos });
                } else {
                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> grabacion de imagenes en b64
                    consultas.saveIMG(sql, imagenes, data.datos[0].id)
                        .then(function(idata) {
                            //
                            console.log(idata);
                            if (idata.resultado === 'ok') {
                                res.json({ resultado: 'ok', datos: data.datos });
                            } else {
                                res.json({ resultado: 'error', datos: idata.mensaje });
                            }
                        })
                        .catch(function(err) {
                            console.log("/cerrarid ", err);
                            res.json({ resultado: 'error', datos: err });
                        });
                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> fin grabacion de imagenes en b64
                }
                //
            } else {
                res.json({ resultado: 'error', datos: data.mensaje });
            }
        })
        .catch(function(err) {
            console.log("/nuevatarea ", err);
            res.json({ resultado: 'error', datos: err });
        });
});

app.post('/consultaid', function(req, res) {
    //
    consultas.consultaID(sql, req.body)
        .then(function(data) {
            //
            console.log(data);
            if (data.resultado === 'ok') {
                //
                res.json({ resultado: 'ok', datos: data.datos });
            } else {
                res.json({ resultado: 'error', datos: data.mensaje });
            }
        })
        .catch(function(err) {
            console.log("/consultaid ", err);
            res.json({ resultado: 'error', datos: err });
        });
});

app.post('/cerrarid', function(req, res) {
    //
    consultas.cerrarID(sql, req.body)
        .then(function(data) {
            //
            console.log(data);
            if (data.resultado === 'ok') {
                //
                if (req.body.imgb64 === undefined) {
                    res.json({ resultado: 'ok', datos: data.datos });
                } else {
                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> grabacion de imagenes en b64
                    consultas.saveIMG(sql, req.body)
                        .then(function(idata) {
                            //
                            console.log(idata);
                            if (idata.resultado === 'ok') {
                                res.json({ resultado: 'ok', datos: idata.datos });
                            } else {
                                res.json({ resultado: 'error', datos: idata.mensaje });
                            }
                        })
                        .catch(function(err) {
                            console.log("/cerrarid ", err);
                            res.json({ resultado: 'error', datos: err });
                        });
                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> fin grabacion de imagenes en b64
                }
                //
            } else {
                res.json({ resultado: 'error', datos: data.mensaje });
            }
        })
        .catch(function(err) {
            console.log("/cerrarid ", err);
            res.json({ resultado: 'error', datos: err });
        });
});

app.post('/getimages', function(req, res) {
    //
    consultas.getImages(sql, req.body)
        .then(function(data) {
            //
            console.log(data);
            if (data.resultado === 'ok') {
                //
                if (data.resultado === 'ok') {
                    res.json({ resultado: 'ok', datos: data.datos });
                } else {
                    res.json({ resultado: 'error', datos: data.mensaje });
                }
            }
        })
        .catch(function(err) {
            console.log("/getimages ", err);
            res.json({ resultado: 'error', datos: err });
        });
});

app.post('/insusr', function(req, res) {
    // variables
    var todo_ok = true;
    var elerror = '';
    var xhoy = new Date();
    xhoy = xhoy.toISOString();
    // los parametros
    var xcodigousr = req.body.codigousr;
    var xempresa = req.body.empresa;
    var xnombre = req.body.nombre;
    var xrut = req.body.rut;
    var xcreacion = xhoy;
    var xactivo = 'SI';
    var xclave = req.body.clave;
    var xemail = req.body.email;
    var xdireccion = req.body.direccion;
    var xciudad = req.body.ciudad;
    var xtelefono = req.body.telefono;
    var ximagen = '';
    var xcodigorol = req.body.codigorol;
    //
    async.series([
        function(callback) {
            if (todo_ok) {
                conex.query("start transaction",
                    function(error, results, fields) {
                        if (error) {
                            //console.log('error: start tran',error);
                            elerror = error;
                            todo_ok = false;
                        } else {
                            console.log('ok: start tran');
                            todo_ok = true;
                        };
                        callback();
                    });
            } else {
                console.log('error: no todo_ok', todo_ok);
                callback();
            };
        },
        function(callback) {
            if (todo_ok) {
                sql = "insert into usuarios (codigousr,nombre,rut,creacion,activo,clave,email,direccion,ciudad,telefono,imagen,codigorol,empresa) values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
                conex.query({ sql, timeout: 3000, values: [xcodigousr, xnombre, xrut, xcreacion, xactivo, xclave, xemail, xdireccion, xciudad, xtelefono, ximagen, xcodigorol, xempresa] },
                    function(error, results, fields) {
                        if (error) {
                            //console.log(error);
                            elerror = error;
                            todo_ok = false;
                        } else {
                            console.log('ok: insert usuarios ');
                            todo_ok = true;
                        };
                        callback();
                    });
            } else {
                console.log('error: no todo_ok', todo_ok);
                callback();
            };
        },
        function(callback) {
            if (todo_ok) {
                sql = "insert into nexo_empresas_usuarios (empresa,codigousr) values (?,?) ";
                conex.query({ sql, values: [xcodigousr, xempresa] },
                    function(error, results, fields) {
                        if (error) {
                            elerror = error;
                            todo_ok = false;
                        } else {
                            console.log('ok: insert nexo_e_u');
                            todo_ok = true;
                        };
                        callback();
                    });
            } else {
                console.log('error: no todo_ok', todo_ok);
                callback();
            };
        },
        function(callback) {
            if (todo_ok) {
                sql = "insert into nexo_usuarios_roles (codigousr,codigorol) values (?,?) ";
                conex.query({ sql, values: [xcodigousr, xcodigorol] },
                    function(error, results, fields) {
                        if (error) {
                            elerror = error;
                            todo_ok = false;
                        } else {
                            console.log('ok: insert nexo_u_r');
                            todo_ok = true;
                        };
                        callback();
                    });
            } else {
                console.log('error: no todo_ok', todo_ok);
                callback();
            };
        },
        function(callback) {
            if (todo_ok) {
                conex.query("commit", function(error, results, fields) {
                    if (error) {
                        elerror = error;
                        todo_ok = false;
                    } else {
                        console.log('ok: commit');
                        todo_ok = true;
                    };
                    callback();
                });
            } else {
                console.log('error: no todo_ok commit ', todo_ok);
                callback();
            };
        },
        function(callback) {
            if (todo_ok) {
                console.log("end");
                res.json({ resultado: 'ok' });
                callback();
            } else {
                conex.query("rollback", function(error, results, fields) {
                    if (error) {
                        res.json({ resultado: 'problemas en rollback ' + eror });
                    } else {
                        console.log('ok: rollback');
                        res.json({ resultado: 'problemas', texto: elerror });
                    };
                    callback();
                });
            }
        }
    ]);
});

app.post('/proalma', function(req, res) {
    // la tabla a leer
    var xsp = req.body.sp || '';
    var xid = req.body.id || '-1';
    var xusr = req.body.usuario || '';
    var xcerrada = req.body.cerrada || 0;
    var query = '';
    //
    if (xsp == 'redcount') { query = "call " + xsp + "( '" + xusr + "', " + xcerrada + " )"; } else if (xsp == 'red1') { query = "call " + xsp + "( " + xid + ")"; } else if (xsp == 'red2') { query = "call " + xsp + "( " + xid + ")"; }
    //
    console.log(query);
    //	
    conex.query({ sql: query, timeout: 4000 },
        function(er, rs, fields) {
            if (er == null) {
                //console.log(rs);
                res.json(rs);
            } else {
                res.json(er.code);
            }
        })
});

// http://localhost:8081/sendmail
app.post('/sendmail', function(req, res) {
    // la tabla a leer
    var xRutCorreo = req.body.rutocorreo || '';
    // 
    console.log(xRutCorreo);
    //
    conex.query({
            sql: "select rut,codigousr,nombre,clave,email from usuarios where ( rut=? or email=? ) limit 1",
            timeout: 2000,
            values: [xRutCorreo, xRutCorreo]
        },
        function(er, results, fields) {
            if (er) {
                console.log('error->', er);
                res.status(500).send(er.message);
                //throw er; 
            } else {
                //---------------------------------------------	
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'jogv66@gmail.com',
                        pass: 'murielybelen'
                    }
                });
                var mailOptions = {
                    from: 'Equipo RDMA <equipo@rdma.cl>',
                    to: results[0].email,
                    subject: 'Recordarle sus datos : ' + results[0].nombre,
                    html: `Estimad@.<br>
								  Recibimos una peticion para enviarle sus datos no recordados.<br>
								  Rut : <b>` + results[0].rut + `</b><br>
								  Email : <b>` + results[0].email + `</b><br>
								  Nombre de usuario : <b>` + results[0].nombre + `</b><br>
								  Clave: <b>` + results[0].clave + `</b>
								  <br><br>
								  Saludos.`
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log('error en sendmail->', error);
                        res.status(500).send(error.message);
                    } else {
                        console.log("Email enviado");
                        res.status(200).send(req.body);
                    }
                });
                //---------------------------------------------	
            };
        });

});