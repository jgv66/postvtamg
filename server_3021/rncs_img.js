
module.exports = {
  
  grabaImg_001( conex, base64, id, tipo_nombre ) {
    //
    var ba64      = require("ba64"),
        data_url  = "data:image/jpeg;base64,"+base64,
        img_name  = "./public/img/"+ tipo_nombre + id,
        query     = '' ;

    console.log('grabaImg_001 :', img_name ); 
    // para guardar el nombre de la extension
    // extension = ba64.getExt( base64 );
    // Save the image synchronously.
    ba64.writeImageSync( img_name, data_url); // Saves myimage.jpeg.

    // Or save the image asynchronously.
    ba64.writeImage( img_name, data_url, function(err){
        if (err) throw err;
        //
        console.log("Image disk-saved successfully");
        //
        query = "call sp_inserta_img ( "+id+",'"+tipo_nombre+"' ) ;";
        //
        console.log( query );
        //
        conex.query({ sql: query, timeout: 2000	}, 
          function (er) { 
            if (er) { console.log('Image error->',er); } 
            else 	  { console.log("Image db-saved successfully"); };
          });
    });    
  },

}
