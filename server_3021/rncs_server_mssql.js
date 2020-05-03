// console.log("hola mundo");
var express = require('express');
var cors = require('cors');
var app = express();
//
var dbconex = require('./rncs_conexion_mssql.js');
var consultas = require('./rncs_consultas.js');
var async = require("async");
// imagenes 
var _ttoImg = require('./rncs_img.js');
var path = require('path');

//---------------------------------- pruebas multer
var multer = require('multer');
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

// dejare el server myssql siempre activo
var sql = require('mssql');
var conex = sql.connect(dbconex);

//---------------------------------- pruebas multer
var storage = multer.diskStorage({
    destination: function(req, file, cb) { cb(null, './public/uploads/'); },
    filename: function(req, file, cb) {
        cb(null, Date.now().toISOString() + file.originalname + '.jpg');
    }
});
//
var upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }
});
//
//Image fetching module Path,still in testing 
app.post('/Image', function(req, res, next) {
    console.log('llegando al IMAGE');
    var upload = multer({ storage: storage }).single('Image');
    upload(req, res, function(err) {
        var obj = {};
        if (err) {
            console.log("reques body : ", req.body);
            console.log("request file : ", req.file);
            obj.status = 'failed';
            obj.message = 'Error while loading image Capture';
            obj.error = err;
            return res.status(200).json(obj);
        } else {
            console.log("reques body : ", req.body);
            console.log("request file : ", req.file);
            var onlyPath = require('path').dirname(process.mainModule.filename);
            obj.status = 'success';
            obj.message = 'Image  loaded successfully';
            obj.path = onlyPath + "\\" + req.file.path;
            return res.status(200).json(obj);
        }
    });

});

app.post('/profile', upload.single('avatar'), function(req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
});

app.post('/photos/upload', upload.array('photos', 12), function(req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
});

var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function(req, res, next) {
    // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
    //
    // e.g.
    //  req.files['avatar'][0] -> File
    //  req.files['gallery'] -> Array
    //
    // req.body will contain the text fields, if there were any
});

//-------------------------------------------------

app.post('/postusr', function(req, res) {
    //
    consultas.postUsr(sql, req.body)
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
            console.log("/validarUser ", err);
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
    consultas.nuevaTarea(sql, req.body)
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
            console.log("/nuevatarea ", err);
            res.json({ resultado: 'error', datos: err });
        });
});

app.post('/consultaid',
    function(req, res) {
        // los parametros
        var usuario = req.body.codigousr || '';
        var empresa = req.body.empresa || '1';
        var id = req.body.id || '';
        var responsable = req.body.responsable || '';
        var experto = req.body.experto || '';
        var query = "call sp_rescataid ( '" + usuario + "'," + empresa + "," + id + ",'" + responsable + "','" + experto + "' ) ;";
        //
        console.log(query);
        //
        conex.query({ sql: query, timeout: 2000 },
            function(er, results) {
                if (er) {
                    console.log('error->', er);
                    res.json({ resultado: 'error' });
                } else {
                    console.log(results);
                    res.json(results);
                };
            });
    }
);

app.post('/cerrarid',
    function(req, res) {
        // fecha de hoy
        var xhoy = new Date();
        xhoy = xhoy.toISOString();
        // los parametros
        var usuario = req.body.codigousr || '';
        var empresa = req.body.empresa || '1';
        var id = req.body.id || '';
        var responsable = req.body.responsable || '';
        var experto = req.body.experto || '';
        var fechacierre = req.body.fechacierre || xhoy;
        var observacion = req.body.observacion || '';
        var img_base64 = req.body.img_base64 || '';
        var tipo_nombre;
        //
        if (responsable == 'R') { tipo_nombre = 'res_'; } else if (experto == 'E') { tipo_nombre = 'exp_'; }
        //
        var query = "call sp_cierraid ( '" + usuario + "'," + empresa + "," + id + ",'" + fechacierre + "','" + observacion + "','" + responsable + "','" + experto + "' ) ;";
        //
        console.log(query);
        //
        conex.query({ sql: query, timeout: 2000 },
            function(er, results) {
                //
                console.log('results', results);
                console.log('results[0]', results[0]);
                console.log('results[0][0]', results[0][0]);
                //
                if (er) {
                    console.log('error->', er);
                    res.json({ resultado: 'error' });
                } else {
                    console.log(tipo_nombre, results[0][0].id_reg);
                    if (img_base64) {
                        _ttoImg.grabaImg_001(conex, img_base64, id, tipo_nombre);
                    }
                    res.json(results);
                };
            });
    }
);

app.post('/insusr',
    function(req, res) {
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

app.post('/tabla',
    function(req, res) {
        // la tabla a leer
        var xTop = req.body.top || '';
        var xSelect = req.body.select || ' * ';
        var xTabla = req.body.tabla || '';
        var xWhere = req.body.where || '';
        var xOrderBy = req.body.orderby || '';
        //
        if (xTop != '') { xTop = ' limit ' + xTop + ' '; };
        if (xSelect != '') { xSelect = xSelect.trim(); };
        if (xWhere != '') { xWhere = ' where ' + xWhere.trim(); };
        if (xOrderBy != '') { xOrderBy = ' order by ' + xOrderBy.trim(); };
        //
        var query = "select " + xSelect + " from " + xTabla.trim() + " " + xWhere + " " + xTop + xOrderBy;
        console.log(query);
        //	
        conex.query({ sql: query, timeout: 4000 },
            function(er, rs, fields) {
                if (er == null) {
                    res.json(rs);
                } else {
                    res.json(er.code);
                }
            })
    });

app.post('/proalma',
    function(req, res) {
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
app.post('/sendmail',
    function(req, res) {
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