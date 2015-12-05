/**
 * this file will be loaded before server started
 * you can register middleware
 * https://thinkjs.org/doc/middleware.html
 */

/**
 * 
 * think.middleware('xxx', http => {
 *   
 * })
 * 
 */

'use strict';

let locale = think.config('locale'), acceptLanguages, acceptLanguagesLowerCase;
if(locale){ 
  acceptLanguages = Object.keys(locale);
  acceptLanguagesLowerCase = acceptLanguages.map((o) => o.toLowerCase());
}

think.middleware("check_lang", http => {  
  if(acceptLanguages){
    let lang = http.header('accept-language');
    lang = lang.split(',')[0];
    let idx = acceptLanguagesLowerCase.indexOf(lang);
    if(idx >= 0){
      http.lang(acceptLanguages[idx]);
    } 
  }
});
