'use strict';

import fs from 'fs';
import path from 'path';
import read from 'node-readability';
import pdf from 'html-pdf';
import nodemailer from 'nodemailer';

export default class extends think.service.base {
  /**
   * init
   * 初始化
   */
  init(email) {
    this.email = email;
  }

  /**
   * 获取文章正文
   */
  readContent(html) {
    return new Promise(function(resolve, reject) {
      read(html, function(err, article, meta) {
        if(err) reject(err);
        let {title, content} = article;
        resolve({title, content});
        article.close();
      });
    });
  }

  /**
   * 生成 PDF
   */
  createPDF(filename, content) {
    return new Promise(function(resolve, reject) {
      pdf.create(content).toFile(filename, function(err, res) {
        if(err) reject(err);
        resolve(res.filename);
      });
    });
  }

  /**
   * 发送 PDF
   */
  sendFile(filename, email) {
    console.log(path.basename(filename));
    var option = {
      from: 'send@cicada.org',
      to: email,
      subject: 'cicada to kindle',
      text: 'send from cicada',
      attachments: [
        {filename: path.basename(filename), path: filename}
      ]
    };
    return new Promise(function(resolve, reject) {
      var transporter = nodemailer.createTransport();
      transporter.sendMail(option, function(err, info) {
        if(err || info.accepted.indexOf(email) === -1) reject(err);
        resolve(filename);
      });
    });
  }

  /**
   * 删除文件
   */
   rm(filename) {
     return new Promise(function(resolve, reject) {
       try {
         fs.unlink(filename);
       } catch(err) {
         reject(err);
       }
       resolve(filename);
     });
   }

  run(html) {
    return this.readContent(html)
           .then(article => this.createPDF( path.join(think.RESOURCE_PATH, `${article.title}.pdf`), article.content))
           .then(filename => this.sendFile(filename, this.email))
           .then(this.rm);
  }
}
