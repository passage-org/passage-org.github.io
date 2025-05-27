;; Contains all the dependencies to export from org-mode to html properly
(require 'package)
(setq package-archives '(("gnu"   . "http://elpa.gnu.org/packages/")
			 ("melpa" . "https://melpa.org/packages/")
			 ("org"   . "https://orgmode.org/elpa/")))
(package-initialize)
(package-refresh-contents)
(unless (package-installed-p 'use-package)
  (package-install 'use-package))
(use-package org :ensure t)
(use-package htmlize :ensure t)
(use-package sparql-mode :ensure t)
(use-package csv-mode :ensure t)
(use-package citeproc :ensure t) ;; to export citation in org mode

(setq org-confirm-babel-evaluate nil) ;; does not ask for confirmation to evaluate on export
(setq org-html-htmlize-output-type 'css) ;; so code blocks are exported with classes

(org-babel-do-load-languages
 'org-babel-load-languages
 '((sparql . t)(shell . t)))


;; Actually setup the org2html now:

(setq system-time-locale "C") ;; set locale "en"
(setq navbar
      (with-temp-buffer
        (insert-file-contents "./html/navbar.html")
        (buffer-string)))
(setq copyrights
      (with-temp-buffer
        (insert-file-contents "./html/copyrights.html")
        (buffer-string)))


(setq org-publish-project-alist
      `(("org-passage"
         :base-directory "./"
         :publishing-directory "./public_html/"
         :exclude "^public-html/.*"
         :html-preamble ,navbar
         :html-postamble ,copyrights
         :base-extension "org"
         :recursive t
         :with-macros t
         :publishing-function org-html-publish-to-html)
        ("js-static"
         :base-directory "./js"
         :base-extension "js"
         :publishing-directory "./public_html/js"
         :exclude "^public-html/.*"
         :recursive t
         :publishing-function org-publish-attachment)
        ("css-static"
         :base-directory "./css"
         :base-extension "ttf\\|woff2\\|svg\\|css\\|js\\|png\\|jpg\\|gif\\|pdf\\|mp3\\|ogg\\|swf"
         :publishing-directory "./public_html/css"
         :exclude "^public-html/.*"
         :recursive t
         :publishing-function org-publish-attachment)
        ("figure-static"
         :base-directory "./"
         :base-extension "svg\\|ico"
         :publishing-directory "./public_html/"
         :include ("./blog/ingestion.svg" "./res/passage.svg" "./res/wikidata.svg" "./res/comunica.svg")
         :publishing-function org-publish-attachment)

        ("full-passage" :components ("org-passage" "js-static" "css-static" "figure-static"))))

(delete-directory "./public_html" t)
(org-publish-project "full-passage" t)
;; (copy-directory "./node_modules" "./public_html/node_modules")
