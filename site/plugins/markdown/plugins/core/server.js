var express = require('express'),
  app = module.exports = express(),
  fs = require('fs'),
  path = require('path'),
  request = require('request'),
  qs = require('querystring'),
  phantomjs = require('phantomjs-prebuilt'),
  child = require('child_process'),
  md = require('./markdown-it.js').md,
  folderDetect = require('../../../../../util/folder-detect'),
  filters = require('../../../../../util/filters');


var Kore = function() {

  var folder = path.join(
    process.env.HOME,
    "var/" + global.settings.site.domain + "/documents/" + global.settings.name + "/" + global.settings.target
  );

  function _getFullHtml(name, str, style) {
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + name + '</title><style>' + ((style) ? style : '') + '</style></head><body id="preview">\n' + md.render(str) + '\n</body></html>';
  }

  function _getHtml(str) {
    return md.render(str)
  }

  return {
    fetchMd: function(req, res) {

      var unmd = req.body.unmd,
        json_response = {
          data: '',
          error: false
        }

      var name = req.body.name.trim()

      if (!name.includes('.md')) {
        name = name + '.md'
      }

      var filename = path.resolve(__dirname, folder, name)

      // TODO: THIS CAN BE OPTIMIZED WITH PIPING INSTEAD OF WRITING TO DISK
      fs.writeFile(filename, unmd, 'utf8', function fetchMdWriteFileCb(err, data) {
          if (err) {
            json_response.error = true
            json_response.data = "Something wrong with the markdown conversion."
            res.send(JSON.stringify(json_response))
            console.error(err)
          } else {
            var stat = fs.statSync(filename);
            json_response.data = stat ? stat.ino : name
            res.send(JSON.stringify(json_response))
          }
        }) // end writeFile
    },
    downloadMd: function(req, res) {

      var fileId = req.params.mdid

      var filePath = folderDetect.getSync(fileId, folder, filters.md);

      var fileName = path.basename(filePath);

      res.download(filePath, fileName, function downloadMdDownloadCb(err) {
          if (err) {
            console.error(err)
            res.status(err.status).send(err.code)
          } else {
            // Delete the file after download
            // setTimeout(function unlinkCbInSetTimeout() {

            //     fs.unlink(filePath, function(err, data) {
            //         if (err) return console.error(err)
            //         console.log(filePath + " was unlinked")

            //       }, 60000) // end unlink

            //   }) // end setTimeout

          } // end else

        }) // end res.download

    },
    fetchHtml: function(req, res) {

      var unmd = req.body.unmd,
        json_response = {
          data: '',
          error: false
        }

      // For formatted HTML or not...
      var format = req.body.formatting;

      if (!format) {
        format = "";
      } else {
        format = fs.readFileSync(path.resolve(__dirname, '../../public/markdown/css/classes.all.css')).toString('utf-8');
      }

      var html = _getFullHtml(req.body.name, unmd, format);

      var name = req.body.name.trim() + '.html'

      var filename = path.resolve(__dirname, folder, name)

      fs.writeFile(filename, html, 'utf8', function writeFileCbFetchHtml(err, data) {

          if (err) {
            json_response.error = true
            json_response.data = "Something wrong with the markdown conversion."
            console.error(err)
            res.json(json_response)
          } else {
            var stat = fs.statSync(filename);
            json_response.data = stat ? stat.ino : name
            res.json(json_response)
          }
        }) // end writeFile
    },
    fetchHtmlDirect: function(req, res) {

      var unmd = req.body.unmd,
        root = req.body.root,
        title = req.body.title,
        id = req.body.id,
        json_response = {
          data: '',
          error: false
        }

      if (!unmd) {
        var pathname = null;
        if (root) {
          pathname = path.join(global.settings.paths.root, title);

          if (title === 'README.md' && !fs.existsSync(pathname)) {
            unmd = global.settings.description;
          }
        } else if (title) {
          pathname = path.join(folder, title);
        } else if (id) {
          pathname = folderDetect.getSync(id, folder, filters.md);
        }

        if (!unmd && pathname) {
          unmd = fs.readFileSync(pathname, 'utf8');
        }
      }

      var html = _getHtml(unmd)

      json_response.data = html
      res.json(json_response)
    },
    downloadHtml: function(req, res) {

      var fileId = req.params.html

      var filePath = folderDetect.getSync(fileId, folder, filters.html);

      var fileName = path.basename(filePath);

      res.download(filePath, fileName, function downloadHtmlDownloadCb(err) {
          if (err) {
            console.error(err)
            res.status(err.status).send(err.code)
          } else {

            // Delete the file after download
            setTimeout(function unlinkDownloadHtmlCb() {

                fs.unlink(filePath, function(err, data) {
                    if (err) return console.error(err)
                    console.log(filePath + " was unlinked")

                  }, 60000) // end unlink

              }) // end setTimeout

          } // end else

        }) // end res.download

    },
    fetchPdf: function(req, res) {

      var unmd = req.body.unmd,
        json_response = {
          data: '',
          error: false
        }

      var name = req.body.name.trim();

      var format = fs.readFileSync(path.resolve(__dirname, '../../public/markdown/css/classes.all.css')).toString('utf-8')
      var html = _getFullHtml(name, unmd, format)
      var temp = path.resolve(__dirname, folder, name + '2pdf.temp.html')

      fs.writeFile(temp, html, 'utf8', function fetchPdfWriteFileCb(err, data) {

        if (err) {
          json_response.error = true
          json_response.data = "Something wrong with the pdf conversion."
          console.error(err)
          res.json(json_response)
        } else {
          name = name + '.pdf'
          var filename = path.resolve(__dirname, folder, name)

          var childArgs = [
            path.join(__dirname, 'render.js'),
            temp,
            filename
          ];

          child.execFile(phantomjs.path, childArgs, function childExecFileCb(err, stdout, stderr) {
            if (err) {
              json_response.error = true
              json_response.data = "Something wrong with the pdf conversion."
              console.error(err)
              res.json(json_response)
            } else {
              var stat = fs.statSync(filename);
              json_response.data = stat ? stat.ino : name
              res.json(json_response)
            }

            setTimeout(function unlinkHtml2PdfTempCb() {
              fs.unlink(temp, function(err, data) {
                if (err) return console.error(err)
                console.log(temp + " was unlinked")
              })
            })

          })
        }
      })
    },
    downloadPdf: function(req, res) {

        var fileId = req.params.pdf

        var filePath = folderDetect.getSync(fileId, folder, filters.pdf);

        var fileName = path.basename(filePath);

        res.download(filePath, fileName, function downloadPdfDownloadCb(err) {
          if (err) {
            console.error(err)
            res.status(err.status).send(err.code)
          } else {
            setTimeout(function unlinkDownloadPdfCb() {
              fs.unlink(filePath, function(err, data) {
                if (err) return console.error(err)
                console.log(filePath + " was unlinked")
              })
            })
          }
        })
      } // end
  }

}

const Core = new Kore();

/* Start Dillinger Routes */

// save a markdown file and send header to download it directly as response
app.post('/markdown/factory/fetch_markdown', Core.fetchMd)

// Route to handle download of md file
app.get('/markdown/files/md/:mdid', Core.downloadMd)

// Save an html file and send header to download it directly as response
app.post('/markdown/factory/fetch_html', Core.fetchHtml)

app.post('/markdown/factory/fetch_html_direct', Core.fetchHtmlDirect)

// Route to handle download of html file
app.get('/markdown/files/html/:html', Core.downloadHtml)

// Save a pdf file and send header to download it directly as response
app.post('/markdown/factory/fetch_pdf', Core.fetchPdf)

// Route to handle download of pdf file
app.get('/markdown/files/pdf/:pdf', Core.downloadPdf)

/* End Dillinger Core */