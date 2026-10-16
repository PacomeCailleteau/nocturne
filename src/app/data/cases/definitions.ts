import type { CaseDefinition } from '../../domain/case-definition';

export const DEFINITIONS = [
  {
    "id": "the-silent-frame",
    "revision": "2026-10-16.1",
    "title": {
      "fr": "Le cadre silencieux",
      "en": "The Silent Frame"
    },
    "subtitle": {
      "fr": "Un cadre vide. Quatre traces sur papier.",
      "en": "An empty frame. Four traces on paper."
    },
    "briefing": {
      "fr": "À la fermeture, un cadre est découvert vide. Une enveloppe, un registre et un rapport ont changé de casier. Identifiez leurs œuvres témoins pour reconstruire le bordereau de la peinture disparue. Les documents de cette enquête sont fictifs ; les œuvres et leurs fiches sont réelles.",
      "en": "At closing time, a frame is found empty. An envelope, a register and a report have changed lockers. Identify their witness works to reconstruct the missing painting’s dispatch sheet. The case documents are fictional; the works and records are real."
    },
    "introduction": {
      "fr": "Résolvez les quatre épreuves dans l’ordre de votre choix. Chaque réussite ajoute un indice au carnet, puis les quatre candidates deviennent consultables pour votre conclusion.",
      "en": "Solve the four challenges in any order. Each success adds a clue to your notebook; the four candidates then become available for your conclusion."
    },
    "difficulty": {
      "fr": "Initiation",
      "en": "Introductory"
    },
    "estimatedMinutes": [
      10,
      15
    ],
    "accent": "amber",
    "coverArtworkId": 436964,
    "candidateIds": [
      437655,
      436535,
      334652,
      435876
    ],
    "targetArtworkId": 436535,
    "witnessIds": [
      437881,
      436964,
      436451
    ],
    "puzzles": [
      {
        "id": "silent-fragment",
        "title": {
          "fr": "Le fragment retrouvé",
          "en": "The recovered fragment"
        },
        "prompt": {
          "fr": "Une photographie de détail a été retrouvée dans le dossier. À quelle œuvre témoin appartient-elle ?",
          "en": "A detail photograph was recovered in the file. Which witness artwork does it belong to?"
        },
        "instructions": {
          "fr": "Comparez le fragment aux trois reproductions. Sélectionnez une œuvre ; les descriptions visuelles offrent la même information que l’image.",
          "en": "Compare the fragment with the three reproductions. Select one work; the visual descriptions provide the same information as the image."
        },
        "witnessIds": [
          437881,
          436964,
          436451
        ],
        "hints": [
          {
            "fr": "Comparez les formes et les objets, pas seulement les couleurs.",
            "en": "Compare shapes and objects, not only colours."
          },
          {
            "fr": "Un perroquet gris se penche au-dessus d’un perchoir brun et d’un petit récipient.",
            "en": "A grey parrot bends over a brown perch and a small vessel."
          },
          {
            "fr": "Le détail et la description concordent uniquement avec Young Lady in 1866. La note fictive associée livre un indice sur l’œuvre disparue.",
            "en": "The detail and description match only Young Lady in 1866. The associated fictional note provides a clue about the missing work."
          }
        ],
        "explanation": {
          "fr": "Le détail et la description concordent uniquement avec Young Lady in 1866. La note fictive associée livre un indice sur l’œuvre disparue.",
          "en": "The detail and description match only Young Lady in 1866. The associated fictional note provides a clue about the missing work."
        },
        "wrongAnswer": {
          "fr": "Le détail ne correspond pas à cette reproduction. Comparez les objets, contours et gestes avec la description du fragment.",
          "en": "The detail does not match this reproduction. Compare its objects, outlines and gestures with the fragment description."
        },
        "pieces": [
          {
            "id": "silent-photo-note",
            "title": {
              "fr": "Enveloppe de la photographie",
              "en": "Photograph envelope"
            },
            "text": {
              "fr": "Document fictif : « Le détail identifie le bon casier. Son bordereau classe l’œuvre disparue parmi les peintures. » Le détail lui-même provient d’une reproduction du Met.",
              "en": "Fictional document: “The detail identifies the right locker. Its dispatch sheet classifies the missing work as a painting.” The detail itself comes from a Met reproduction."
            },
            "provenance": "fictional-document",
            "artworkIds": [
              437881,
              436964,
              436451
            ],
            "fields": [
              "objectName"
            ]
          }
        ],
        "clue": {
          "id": "silent-fragment-clue",
          "text": {
            "fr": "La fiche de transport fictive indique une peinture, et non un dessin.",
            "en": "The fictional transport sheet specifies a painting rather than a drawing."
          },
          "predicates": [
            {
              "field": "objectName",
              "operator": "equals",
              "value": "Painting"
            }
          ],
          "sourcePieceId": "silent-photo-note"
        },
        "kind": "fragment",
        "fragment": {
          "artworkId": 436964,
          "path": "/artworks/fragment-436964.webp",
          "crop": {
            "x": 0.7,
            "y": 0.3,
            "width": 0.28,
            "height": 0.36
          },
          "alt": {
            "fr": "Un perroquet gris se penche au-dessus d’un perchoir brun et d’un petit récipient.",
            "en": "A grey parrot bends over a brown perch and a small vessel."
          },
          "observation": {
            "fr": "Un perroquet gris se penche au-dessus d’un perchoir brun et d’un petit récipient.",
            "en": "A grey parrot bends over a brown perch and a small vessel."
          }
        },
        "options": [
          {
            "id": "work-437881",
            "artworkId": 437881,
            "observation": {
              "fr": "Femme coiffée de blanc près d’une fenêtre et d’une aiguière.",
              "en": "Woman in a white headdress beside a window and a pitcher."
            }
          },
          {
            "id": "work-436964",
            "artworkId": 436964,
            "observation": {
              "fr": "Femme en robe rose près d’un perroquet gris sur son perchoir.",
              "en": "Woman in a pink dress beside a grey parrot on its perch."
            }
          },
          {
            "id": "work-436451",
            "artworkId": 436451,
            "observation": {
              "fr": "Paysage aux arbres tropicaux, figures et cheval.",
              "en": "Landscape with tropical trees, figures and a horse."
            }
          }
        ],
        "answer": "work-436964"
      },
      {
        "id": "silent-chronology",
        "title": {
          "fr": "Les archives chronologiques",
          "en": "The chronological archive"
        },
        "prompt": {
          "fr": "Rétablissez l’ordre de création des œuvres témoins, de la plus ancienne à la plus récente.",
          "en": "Restore the witness works from earliest to latest creation."
        },
        "instructions": {
          "fr": "Consultez les bornes numériques objectBeginDate et objectEndDate de l’API du Met, affichées dans le dossier. Déplacez chaque carte à sa position ; la fin d’un intervalle doit précéder le début du suivant. Le libellé de date du musée est conservé séparément et peut différer. Les années négatives précèdent notre ère.",
          "en": "Consult the Met API’s numeric objectBeginDate and objectEndDate bounds displayed in the dossier. Move each card into position; each interval must end before the next begins. The museum’s display-date text is retained separately and may differ. Negative years are BCE."
        },
        "witnessIds": [
          437881,
          436964,
          436451
        ],
        "hints": [
          {
            "fr": "Une date approximative est un intervalle, pas une année exacte.",
            "en": "An approximate date is an interval, not an exact year."
          },
          {
            "fr": "Commencez par l’œuvre dont la borne de fin est la plus ancienne.",
            "en": "Start with the work whose end bound is earliest."
          },
          {
            "fr": "L’ordre est Young Woman with a Water Pitcher (1657–1667) → Young Lady in 1866 (1866–1866) → Tahitian Landscape (1892–1892). La fin de chaque intervalle précède le début du suivant ; aucune année médiane n’est inventée.",
            "en": "The order is Young Woman with a Water Pitcher (1657–1667) → Young Lady in 1866 (1866–1866) → Tahitian Landscape (1892–1892). Each interval ends before the next begins; no midpoint year is invented."
          }
        ],
        "explanation": {
          "fr": "L’ordre est Young Woman with a Water Pitcher (1657–1667) → Young Lady in 1866 (1866–1866) → Tahitian Landscape (1892–1892). La fin de chaque intervalle précède le début du suivant ; aucune année médiane n’est inventée.",
          "en": "The order is Young Woman with a Water Pitcher (1657–1667) → Young Lady in 1866 (1866–1866) → Tahitian Landscape (1892–1892). Each interval ends before the next begins; no midpoint year is invented."
        },
        "wrongAnswer": {
          "fr": "Cet ordre ne respecte pas tous les intervalles. La borne de fin de chaque œuvre doit précéder la borne de début de la suivante.",
          "en": "This order does not respect every interval. Each work’s end bound must precede the next work’s start bound."
        },
        "pieces": [
          {
            "id": "silent-register",
            "title": {
              "fr": "Registre des mouvements",
              "en": "Movement register"
            },
            "text": {
              "fr": "Document fictif : « Après classement des trois témoins, lire la borne supérieure du transfert : 1889. La borne de fin de l’œuvre recherchée ne la dépasse pas. »",
              "en": "Fictional document: “After ordering the three witnesses, read the transfer’s upper bound: 1889. The missing work’s end date does not exceed it.”"
            },
            "provenance": "fictional-document",
            "artworkIds": [
              437881,
              436964,
              436451
            ],
            "fields": [
              "objectBeginDate",
              "objectEndDate"
            ]
          }
        ],
        "clue": {
          "id": "silent-chronology-clue",
          "text": {
            "fr": "Le registre fictif place toute la datation de l’œuvre disparue au plus tard en 1889.",
            "en": "The fictional register places the missing work’s entire date interval no later than 1889."
          },
          "predicates": [
            {
              "field": "objectEndDate",
              "operator": "at-most",
              "value": 1889
            }
          ],
          "sourcePieceId": "silent-register"
        },
        "kind": "chronology",
        "items": [
          {
            "id": "work-436451",
            "artworkId": 436451
          },
          {
            "id": "work-436964",
            "artworkId": 436964
          },
          {
            "id": "work-437881",
            "artworkId": 437881
          }
        ],
        "answer": [
          "work-437881",
          "work-436964",
          "work-436451"
        ]
      },
      {
        "id": "silent-report",
        "title": {
          "fr": "Le rapport contradictoire",
          "en": "The contradictory report"
        },
        "prompt": {
          "fr": "Une seule affirmation de ce rapport fictif contredit une donnée présente dans les fiches du Met. Laquelle ?",
          "en": "Exactly one statement in this fictional report contradicts a documented Met field. Which one?"
        },
        "instructions": {
          "fr": "Ouvrez les fiches témoins et confrontez les affirmations aux champs indiqués. Une information absente ne constitue jamais une contradiction.",
          "en": "Open the witness records and compare each statement with its named field. Missing information is never a contradiction."
        },
        "witnessIds": [
          437881,
          436964,
          436451
        ],
        "hints": [
          {
            "fr": "Vérifiez les champs nommés dans le rapport.",
            "en": "Check the fields named in the report."
          },
          {
            "fr": "Les supports et les bornes de dates sont des preuves ; l’absence d’un nom d’artiste n’en est pas une.",
            "en": "Supports and date bounds are evidence; an absent artist name is not."
          },
          {
            "fr": "Tahitian Landscape est documenté « Oil on canvas », et non « Oil on wood ». Les deux autres affirmations concordent avec leurs fiches.",
            "en": "Tahitian Landscape is documented as “Oil on canvas”, not “Oil on wood”. The other two statements agree with their records."
          }
        ],
        "explanation": {
          "fr": "Tahitian Landscape est documenté « Oil on canvas », et non « Oil on wood ». Les deux autres affirmations concordent avec leurs fiches.",
          "en": "Tahitian Landscape is documented as “Oil on canvas”, not “Oil on wood”. The other two statements agree with their records."
        },
        "wrongAnswer": {
          "fr": "Cette affirmation concorde avec un champ documenté. Cherchez celle qui est réfutée par une donnée présente, pas par une information manquante.",
          "en": "This statement agrees with a documented field. Look for one disproved by a present value, not by missing information."
        },
        "pieces": [
          {
            "id": "silent-report-sheet",
            "title": {
              "fr": "Rapport du gardien",
              "en": "Guard’s report"
            },
            "text": {
              "fr": "Document fictif contenant trois affirmations à vérifier. La correction du support révèle le code « huile sur toile » du bordereau de l’œuvre disparue.",
              "en": "Fictional document containing three statements to verify. Correcting the support reveals the missing work’s dispatch code, “oil on canvas”."
            },
            "provenance": "fictional-document",
            "artworkIds": [
              437881,
              436964,
              436451
            ],
            "fields": [
              "medium",
              "objectBeginDate"
            ]
          }
        ],
        "clue": {
          "id": "silent-report-clue",
          "text": {
            "fr": "La correction du rapport fictif précise le support recherché : huile sur toile.",
            "en": "The corrected fictional report specifies the missing work’s medium: oil on canvas."
          },
          "predicates": [
            {
              "field": "medium",
              "operator": "equals",
              "value": "Oil on canvas"
            }
          ],
          "sourcePieceId": "silent-report-sheet"
        },
        "kind": "contradiction",
        "statements": [
          {
            "id": "pitcher-support",
            "artworkId": 437881,
            "text": {
              "fr": "La fiche de Young Woman with a Water Pitcher indique une huile sur toile.",
              "en": "The record for Young Woman with a Water Pitcher lists oil on canvas."
            },
            "assertion": {
              "field": "medium",
              "operator": "equals",
              "value": "Oil on canvas"
            }
          },
          {
            "id": "lady-date",
            "artworkId": 436964,
            "text": {
              "fr": "La borne de début de Young Lady in 1866 est 1866.",
              "en": "The start date of Young Lady in 1866 is 1866."
            },
            "assertion": {
              "field": "objectBeginDate",
              "operator": "equals",
              "value": 1866
            }
          },
          {
            "id": "landscape-support",
            "artworkId": 436451,
            "text": {
              "fr": "La fiche de Tahitian Landscape indique une huile sur bois.",
              "en": "The record for Tahitian Landscape lists oil on wood."
            },
            "assertion": {
              "field": "medium",
              "operator": "equals",
              "value": "Oil on wood"
            }
          }
        ],
        "answer": "landscape-support"
      },
      {
        "id": "silent-label",
        "title": {
          "fr": "Le cartel déchiré",
          "en": "The torn label"
        },
        "prompt": {
          "fr": "Réassemblez le cartel de Young Lady in 1866. Le verso contient un renseignement du transport ; aucun résultat d’une autre épreuve n’est nécessaire.",
          "en": "Reassemble the label for Young Lady in 1866. Its reverse contains a transport detail; no other challenge result is needed."
        },
        "instructions": {
          "fr": "Le gabarit du musée impose cet ordre : artiste → titre → date → technique. Chaque fragment occupe exactement une de ces fonctions.",
          "en": "The museum template requires this order: artist → title → date → medium. Each fragment fills exactly one role."
        },
        "witnessIds": [
          436964
        ],
        "hints": [
          {
            "fr": "Repérez le nom propre de l’artiste et la technique.",
            "en": "Identify the artist’s proper name and the medium."
          },
          {
            "fr": "Le titre contient une année, mais le fragment de date ne contient que 1866.",
            "en": "The title includes a year, but the date fragment contains only 1866."
          },
          {
            "fr": "Le cartel se lit : Edouard Manet → Young Lady in 1866 → 1866 → Oil on canvas. Les quatre fragments reprennent la fiche du témoin. Le verso fictif fixe la borne inférieure de l’œuvre disparue à 1882.",
            "en": "The label reads: Edouard Manet → Young Lady in 1866 → 1866 → Oil on canvas. All four fragments reproduce the witness record. Its fictional reverse sets the missing work’s lower date bound at 1882."
          }
        ],
        "explanation": {
          "fr": "Le cartel se lit : Edouard Manet → Young Lady in 1866 → 1866 → Oil on canvas. Les quatre fragments reprennent la fiche du témoin. Le verso fictif fixe la borne inférieure de l’œuvre disparue à 1882.",
          "en": "The label reads: Edouard Manet → Young Lady in 1866 → 1866 → Oil on canvas. All four fragments reproduce the witness record. Its fictional reverse sets the missing work’s lower date bound at 1882."
        },
        "wrongAnswer": {
          "fr": "Le gabarit n’est pas respecté. L’ordre demandé est artiste, titre, date, puis technique ; le titre peut lui-même contenir une année.",
          "en": "The template is not satisfied. The required order is artist, title, date, then medium; the title itself may contain a year."
        },
        "pieces": [
          {
            "id": "silent-label-piece",
            "title": {
              "fr": "Gabarit et verso du cartel",
              "en": "Label template and reverse"
            },
            "text": {
              "fr": "Gabarit éditorial : artiste, titre, date, technique. Verso fictif : « Transfert : pas avant 1882. » Les fragments de face sont des données du Met, sans attribution historique au verso.",
              "en": "Editorial template: artist, title, date, medium. Fictional reverse: “Transfer: not before 1882.” Front fragments are Met data; the reverse makes no historical claim."
            },
            "provenance": "fictional-document",
            "artworkIds": [
              436964
            ],
            "fields": [
              "artistDisplayName",
              "title",
              "objectDate",
              "medium"
            ]
          }
        ],
        "clue": {
          "id": "silent-label-clue",
          "text": {
            "fr": "Le verso du cartel fictif indique une borne de début égale ou postérieure à 1882.",
            "en": "The fictional label’s reverse gives a start date of 1882 or later."
          },
          "predicates": [
            {
              "field": "objectBeginDate",
              "operator": "at-least",
              "value": 1882
            }
          ],
          "sourcePieceId": "silent-label-piece"
        },
        "kind": "torn-label",
        "fragments": [
          {
            "id": "label-medium",
            "text": {
              "fr": "Huile sur toile",
              "en": "Oil on canvas"
            },
            "role": "medium"
          },
          {
            "id": "label-date",
            "text": {
              "fr": "1866",
              "en": "1866"
            },
            "role": "date"
          },
          {
            "id": "label-artist",
            "text": {
              "fr": "Edouard Manet",
              "en": "Edouard Manet"
            },
            "role": "artist"
          },
          {
            "id": "label-title",
            "text": {
              "fr": "Jeune dame en 1866",
              "en": "Young Lady in 1866"
            },
            "role": "title"
          }
        ],
        "answer": [
          "label-artist",
          "label-title",
          "label-date",
          "label-medium"
        ],
        "artworkId": 436964,
        "template": [
          "artist",
          "title",
          "date",
          "medium"
        ]
      }
    ],
    "conclusion": {
      "fr": "L’œuvre disparue est Wheat Field with Cypresses de Vincent van Gogh, datée de 1889. C’est une peinture à l’huile sur toile dont l’intervalle commence en 1882 ou après et se termine en 1889 ou avant. Le dessin de Seurat échoue au type et au support, sa peinture est trop ancienne, et l’intervalle de Madame Cézanne dépasse 1889. L’histoire du transfert est une fiction ; l’identification et les dates proviennent du Met.",
      "en": "The missing work is Vincent van Gogh’s Wheat Field with Cypresses, dated 1889. It is an oil-on-canvas painting whose interval begins in or after 1882 and ends in or before 1889. Seurat’s drawing fails the type and medium clues, his painting is too early, and Madame Cézanne’s interval extends beyond 1889. The transfer story is fictional; the identification and dates come from the Met."
    },
    "assistedConclusion": {
      "fr": "Suivons ensemble les quatre indices. L’œuvre disparue est Wheat Field with Cypresses de Vincent van Gogh, datée de 1889. C’est une peinture à l’huile sur toile dont l’intervalle commence en 1882 ou après et se termine en 1889 ou avant. Le dessin de Seurat échoue au type et au support, sa peinture est trop ancienne, et l’intervalle de Madame Cézanne dépasse 1889. L’histoire du transfert est une fiction ; l’identification et les dates proviennent du Met.",
      "en": "Let us follow the four clues together. The missing work is Vincent van Gogh’s Wheat Field with Cypresses, dated 1889. It is an oil-on-canvas painting whose interval begins in or after 1882 and ends in or before 1889. Seurat’s drawing fails the type and medium clues, his painting is too early, and Madame Cézanne’s interval extends beyond 1889. The transfer story is fictional; the identification and dates come from the Met."
    },
    "candidateExplanations": {
      "437655": {
        "fr": "The Forest at Pontaubert commence en 1881, avant la borne minimale de 1882.",
        "en": "The Forest at Pontaubert begins in 1881, before the minimum bound of 1882."
      },
      "436535": {
        "fr": "Cette œuvre satisfait les quatre indices : peinture, huile sur toile, début en 1889 et fin en 1889.",
        "en": "This work satisfies all four clues: painting, oil on canvas, start in 1889 and end in 1889."
      },
      "334652": {
        "fr": "Embroidery; The Artist’s Mother est un dessin au crayon Conté, pas une peinture à l’huile sur toile.",
        "en": "Embroidery; The Artist’s Mother is a Conté-crayon drawing, not an oil-on-canvas painting."
      },
      "435876": {
        "fr": "L’intervalle 1888–1890 de Madame Cézanne dépasse la borne supérieure de 1889.",
        "en": "Madame Cézanne’s 1888–1890 interval exceeds the upper bound of 1889."
      }
    }
  },
  {
    "id": "ink-after-midnight",
    "revision": "2026-10-16.1",
    "title": {
      "fr": "L’encre après minuit",
      "en": "Ink After Midnight"
    },
    "subtitle": {
      "fr": "Des feuilles dispersées. Une attribution à rétablir.",
      "en": "Scattered sheets. An attribution to restore."
    },
    "briefing": {
      "fr": "Dans la réserve des estampes japonaises, une feuille manque à l’appel. Une photographie, un erratum et trois rapports d’examen ont été mélangés. Distinguez artistes, dates et formats imprimés pour identifier la feuille. Le scénario et les rapports sont fictifs ; les œuvres et leurs techniques sont documentées par le Met.",
      "en": "In the Japanese print store, one sheet is missing. A photograph, an erratum and three examination reports have been mixed up. Distinguish artists, dates and printed formats to identify it. The story and reports are fictional; the works and media are documented by the Met."
    },
    "introduction": {
      "fr": "Les quatre tables sont ouvertes. Leurs témoins sont indépendants de l’œuvre disparue. Les notices techniques complètes restent consultables pour vos comparaisons.",
      "en": "All four desks are open. Their witnesses are separate from the missing work. Complete medium records remain available for comparison."
    },
    "difficulty": {
      "fr": "Intermédiaire",
      "en": "Intermediate"
    },
    "estimatedMinutes": [
      10,
      15
    ],
    "accent": "indigo",
    "coverArtworkId": 37193,
    "candidateIds": [
      54303,
      37282,
      56689,
      54433
    ],
    "targetArtworkId": 56689,
    "witnessIds": [
      37189,
      37193,
      78617
    ],
    "puzzles": [
      {
        "id": "ink-fragment",
        "title": {
          "fr": "Le fragment retrouvé",
          "en": "The recovered fragment"
        },
        "prompt": {
          "fr": "Une photographie de détail a été retrouvée dans le dossier. À quelle œuvre témoin appartient-elle ?",
          "en": "A detail photograph was recovered in the file. Which witness artwork does it belong to?"
        },
        "instructions": {
          "fr": "Comparez le fragment aux trois reproductions. Sélectionnez une œuvre ; les descriptions visuelles offrent la même information que l’image.",
          "en": "Compare the fragment with the three reproductions. Select one work; the visual descriptions provide the same information as the image."
        },
        "witnessIds": [
          37189,
          37193,
          78617
        ],
        "hints": [
          {
            "fr": "Comparez les formes et les objets, pas seulement les couleurs.",
            "en": "Compare shapes and objects, not only colours."
          },
          {
            "fr": "Un large torse aux contours noirs, une épaule arrondie et un bras replié ; une bande rouge longe le bord inférieur.",
            "en": "A broad torso outlined in black, a rounded shoulder and a bent arm; a red band runs along the lower edge."
          },
          {
            "fr": "Le détail et la description concordent uniquement avec The Sumo Wrestlers Takaneyama Yoichiemon and Sendagawa Kichigorō. La note fictive associée livre un indice sur l’œuvre disparue.",
            "en": "The detail and description match only The Sumo Wrestlers Takaneyama Yoichiemon and Sendagawa Kichigorō. The associated fictional note provides a clue about the missing work."
          }
        ],
        "explanation": {
          "fr": "Le détail et la description concordent uniquement avec The Sumo Wrestlers Takaneyama Yoichiemon and Sendagawa Kichigorō. La note fictive associée livre un indice sur l’œuvre disparue.",
          "en": "The detail and description match only The Sumo Wrestlers Takaneyama Yoichiemon and Sendagawa Kichigorō. The associated fictional note provides a clue about the missing work."
        },
        "wrongAnswer": {
          "fr": "Le détail ne correspond pas à cette reproduction. Comparez les objets, contours et gestes avec la description du fragment.",
          "en": "The detail does not match this reproduction. Compare its objects, outlines and gestures with the fragment description."
        },
        "pieces": [
          {
            "id": "ink-envelope",
            "title": {
              "fr": "Enveloppe indigo",
              "en": "Indigo envelope"
            },
            "text": {
              "fr": "Document fictif : « La photographie permet de retrouver la liste de prêt. Pour l’œuvre manquante : Utagawa Hiroshige ; ne pas confondre avec Hiroshige II. » Le fragment est tiré de la reproduction du témoin, et non de la candidate recherchée.",
              "en": "Fictional document: “The photograph locates the loan list. Missing work: Utagawa Hiroshige; do not confuse with Hiroshige II.” The fragment comes from the witness reproduction, not the missing candidate."
            },
            "provenance": "fictional-document",
            "artworkIds": [
              37189,
              37193,
              78617
            ],
            "fields": [
              "artistDisplayName"
            ]
          }
        ],
        "clue": {
          "id": "ink-fragment-clue",
          "text": {
            "fr": "La liste de prêt fictive attribue l’œuvre disparue à Utagawa Hiroshige, sans le suffixe II.",
            "en": "The fictional loan list attributes the missing work to Utagawa Hiroshige, without the suffix II."
          },
          "predicates": [
            {
              "field": "artistDisplayName",
              "operator": "equals",
              "value": "Utagawa Hiroshige"
            }
          ],
          "sourcePieceId": "ink-envelope"
        },
        "kind": "fragment",
        "fragment": {
          "artworkId": 37189,
          "path": "/artworks/fragment-37189.webp",
          "crop": {
            "x": 0.15,
            "y": 0.27,
            "width": 0.72,
            "height": 0.3
          },
          "alt": {
            "fr": "Un large torse aux contours noirs, une épaule arrondie et un bras replié ; une bande rouge longe le bord inférieur.",
            "en": "A broad torso outlined in black, a rounded shoulder and a bent arm; a red band runs along the lower edge."
          },
          "observation": {
            "fr": "Un large torse aux contours noirs, une épaule arrondie et un bras replié ; une bande rouge longe le bord inférieur.",
            "en": "A broad torso outlined in black, a rounded shoulder and a bent arm; a red band runs along the lower edge."
          }
        },
        "options": [
          {
            "id": "work-37189",
            "artworkId": 37189,
            "observation": {
              "fr": "Deux lutteurs de sumo dans une estampe verticale.",
              "en": "Two sumo wrestlers in a vertical print."
            }
          },
          {
            "id": "work-37193",
            "artworkId": 37193,
            "observation": {
              "fr": "Village enneigé devant des montagnes, arbre au premier plan.",
              "en": "Snowy village before mountains, with a tree in the foreground."
            }
          },
          {
            "id": "work-78617",
            "artworkId": 78617,
            "observation": {
              "fr": "Livre ouvert montrant une figure près d’un arbuste fleuri.",
              "en": "Open book showing a figure beside a flowering shrub."
            }
          }
        ],
        "answer": "work-37189"
      },
      {
        "id": "ink-chronology",
        "title": {
          "fr": "Les archives chronologiques",
          "en": "The chronological archive"
        },
        "prompt": {
          "fr": "Rétablissez l’ordre de création des œuvres témoins, de la plus ancienne à la plus récente.",
          "en": "Restore the witness works from earliest to latest creation."
        },
        "instructions": {
          "fr": "Consultez les bornes numériques objectBeginDate et objectEndDate de l’API du Met, affichées dans le dossier. Déplacez chaque carte à sa position ; la fin d’un intervalle doit précéder le début du suivant. Le libellé de date du musée est conservé séparément et peut différer. Les années négatives précèdent notre ère.",
          "en": "Consult the Met API’s numeric objectBeginDate and objectEndDate bounds displayed in the dossier. Move each card into position; each interval must end before the next begins. The museum’s display-date text is retained separately and may differ. Negative years are BCE."
        },
        "witnessIds": [
          37189,
          37193,
          78617
        ],
        "hints": [
          {
            "fr": "Une date approximative est un intervalle, pas une année exacte.",
            "en": "An approximate date is an interval, not an exact year."
          },
          {
            "fr": "Commencez par l’œuvre dont la borne de fin est la plus ancienne.",
            "en": "Start with the work whose end bound is earliest."
          },
          {
            "fr": "L’ordre est The Sumo Wrestlers Takaneyama Yoichiemon and Sendagawa Kichigorō (1790–1793) → Seaside Village in Winter, from Hokusai’s Album of Realistic Pictures (Hokusai shashin gafu) (1814–1814) → Hiroshige Picture Album (Hiroshige gafu) (1862–1862). La fin de chaque intervalle précède le début du suivant ; aucune année médiane n’est inventée.",
            "en": "The order is The Sumo Wrestlers Takaneyama Yoichiemon and Sendagawa Kichigorō (1790–1793) → Seaside Village in Winter, from Hokusai’s Album of Realistic Pictures (Hokusai shashin gafu) (1814–1814) → Hiroshige Picture Album (Hiroshige gafu) (1862–1862). Each interval ends before the next begins; no midpoint year is invented."
          }
        ],
        "explanation": {
          "fr": "L’ordre est The Sumo Wrestlers Takaneyama Yoichiemon and Sendagawa Kichigorō (1790–1793) → Seaside Village in Winter, from Hokusai’s Album of Realistic Pictures (Hokusai shashin gafu) (1814–1814) → Hiroshige Picture Album (Hiroshige gafu) (1862–1862). La fin de chaque intervalle précède le début du suivant ; aucune année médiane n’est inventée.",
          "en": "The order is The Sumo Wrestlers Takaneyama Yoichiemon and Sendagawa Kichigorō (1790–1793) → Seaside Village in Winter, from Hokusai’s Album of Realistic Pictures (Hokusai shashin gafu) (1814–1814) → Hiroshige Picture Album (Hiroshige gafu) (1862–1862). Each interval ends before the next begins; no midpoint year is invented."
        },
        "wrongAnswer": {
          "fr": "Cet ordre ne respecte pas tous les intervalles. La borne de fin de chaque œuvre doit précéder la borne de début de la suivante.",
          "en": "This order does not respect every interval. Each work’s end bound must precede the next work’s start bound."
        },
        "pieces": [
          {
            "id": "ink-register",
            "title": {
              "fr": "Registre de l’atelier",
              "en": "Workshop register"
            },
            "text": {
              "fr": "Document fictif : « Après vérification de l’ordre des témoins, conserver seulement les candidates dont la borne de début est 1830 ou postérieure. » Les intervalles restent ceux des fiches, même pour une datation approximative.",
              "en": "Fictional document: “After checking the witness order, retain only candidates whose start bound is 1830 or later.” Intervals remain those in the records, including approximate dates."
            },
            "provenance": "fictional-document",
            "artworkIds": [
              37189,
              37193,
              78617
            ],
            "fields": [
              "objectBeginDate",
              "objectEndDate"
            ]
          }
        ],
        "clue": {
          "id": "ink-chronology-clue",
          "text": {
            "fr": "Le registre fictif exclut toute œuvre dont l’intervalle commence avant 1830.",
            "en": "The fictional register excludes any work whose date interval begins before 1830."
          },
          "predicates": [
            {
              "field": "objectBeginDate",
              "operator": "at-least",
              "value": 1830
            }
          ],
          "sourcePieceId": "ink-register"
        },
        "kind": "chronology",
        "items": [
          {
            "id": "work-78617",
            "artworkId": 78617
          },
          {
            "id": "work-37193",
            "artworkId": 37193
          },
          {
            "id": "work-37189",
            "artworkId": 37189
          }
        ],
        "answer": [
          "work-37189",
          "work-37193",
          "work-78617"
        ]
      },
      {
        "id": "ink-report",
        "title": {
          "fr": "Le rapport contradictoire",
          "en": "The contradictory report"
        },
        "prompt": {
          "fr": "Une seule affirmation de ce rapport fictif contredit une donnée présente dans les fiches du Met. Laquelle ?",
          "en": "Exactly one statement in this fictional report contradicts a documented Met field. Which one?"
        },
        "instructions": {
          "fr": "Ouvrez les fiches témoins et confrontez les affirmations aux champs indiqués. Une information absente ne constitue jamais une contradiction.",
          "en": "Open the witness records and compare each statement with its named field. Missing information is never a contradiction."
        },
        "witnessIds": [
          37189,
          37193,
          78617
        ],
        "hints": [
          {
            "fr": "Vérifiez les champs nommés dans le rapport.",
            "en": "Check the fields named in the report."
          },
          {
            "fr": "Les supports et les bornes de dates sont des preuves ; l’absence d’un nom d’artiste n’en est pas une.",
            "en": "Supports and date bounds are evidence; an absent artist name is not."
          },
          {
            "fr": "La fiche des lutteurs indique « Woodblock print; ink and color on paper », et non une lithographie. La plaque détachée et le livre sont tous deux documentés à l’encre et en couleurs sur papier. L’erratum fictif fixe la borne supérieure à 1856.",
            "en": "The wrestlers’ record says “Woodblock print; ink and color on paper”, not lithography. The detached plate and the book are both documented with ink and colour on paper. The fictional erratum sets the upper date bound at 1856."
          }
        ],
        "explanation": {
          "fr": "La fiche des lutteurs indique « Woodblock print; ink and color on paper », et non une lithographie. La plaque détachée et le livre sont tous deux documentés à l’encre et en couleurs sur papier. L’erratum fictif fixe la borne supérieure à 1856.",
          "en": "The wrestlers’ record says “Woodblock print; ink and color on paper”, not lithography. The detached plate and the book are both documented with ink and colour on paper. The fictional erratum sets the upper date bound at 1856."
        },
        "wrongAnswer": {
          "fr": "Cette affirmation concorde avec un champ documenté. Cherchez celle qui est réfutée par une donnée présente, pas par une information manquante.",
          "en": "This statement agrees with a documented field. Look for one disproved by a present value, not by missing information."
        },
        "pieces": [
          {
            "id": "ink-erratum",
            "title": {
              "fr": "Erratum de l’imprimeur",
              "en": "Printer’s erratum"
            },
            "text": {
              "fr": "Document fictif : trois affirmations techniques et une consigne scellée. La correction ouvre la consigne : « La borne de fin ne dépasse pas 1856. » La technique se vérifie dans la fiche, pas à la seule couleur de l’image.",
              "en": "Fictional document: three technical statements and a sealed instruction. The correction opens the instruction: “The end bound does not exceed 1856.” Technique must be checked in the record, not inferred from image colour."
            },
            "provenance": "fictional-document",
            "artworkIds": [
              37189,
              37193,
              78617
            ],
            "fields": [
              "medium",
              "artistDisplayName"
            ]
          }
        ],
        "clue": {
          "id": "ink-report-clue",
          "text": {
            "fr": "L’erratum fictif indique que l’intervalle de l’œuvre recherchée se termine au plus tard en 1856.",
            "en": "The fictional erratum states that the missing work’s date interval ends no later than 1856."
          },
          "predicates": [
            {
              "field": "objectEndDate",
              "operator": "at-most",
              "value": 1856
            }
          ],
          "sourcePieceId": "ink-erratum"
        },
        "kind": "contradiction",
        "statements": [
          {
            "id": "wrestlers-process",
            "artworkId": 37189,
            "text": {
              "fr": "Les lutteurs sont une lithographie sur papier.",
              "en": "The wrestlers are a lithograph on paper."
            },
            "assertion": {
              "field": "medium",
              "operator": "contains",
              "value": "lithograph"
            }
          },
          {
            "id": "village-paper",
            "artworkId": 37193,
            "text": {
              "fr": "La plaque du village est documentée à l’encre et en couleurs sur papier.",
              "en": "The village plate is documented with ink and colour on paper."
            },
            "assertion": {
              "field": "medium",
              "operator": "contains",
              "value": "ink and color on paper"
            }
          },
          {
            "id": "book-artist",
            "artworkId": 78617,
            "text": {
              "fr": "Le livre est attribué à Utagawa Hiroshige II.",
              "en": "The book is attributed to Utagawa Hiroshige II."
            },
            "assertion": {
              "field": "artistDisplayName",
              "operator": "equals",
              "value": "Utagawa Hiroshige II"
            }
          }
        ],
        "answer": "wrestlers-process"
      },
      {
        "id": "ink-materials",
        "title": {
          "fr": "Les rapports de matériaux",
          "en": "The material reports"
        },
        "prompt": {
          "fr": "Trois rapports fictifs ont perdu le nom de leur œuvre. Associez chaque description documentaire au bon témoin.",
          "en": "Three fictional reports have lost their artwork names. Match each documentary description to its witness."
        },
        "instructions": {
          "fr": "Chaque rapport reçoit une œuvre différente. Comparez le champ technique complet : estampe autonome, plaque détachée ou livre imprimé. La couleur de la reproduction ne suffit pas.",
          "en": "Each report takes a different work. Compare the complete medium field: standalone print, detached plate or printed book. Reproduction colour is insufficient."
        },
        "witnessIds": [
          37189,
          37193,
          78617
        ],
        "hints": [
          {
            "fr": "L’encre, la couleur et le papier sont communs : recherchez le format documentaire.",
            "en": "Ink, colour and paper are shared: look for documentary format."
          },
          {
            "fr": "« Detached plate » désigne une plaque détachée ; « printed book » sans cette mention désigne le livre complet.",
            "en": "“Detached plate” means a plate removed from a book; “printed book” without that qualifier identifies the complete book."
          },
          {
            "fr": "Rapport A → les lutteurs : estampe autonome. Rapport B → le village : plaque détachée d’un livre imprimé. Rapport C → l’album Hiroshige : livre imprimé complet. Les trois notices mentionnent l’encre et la couleur sur papier, mais leurs formats documentés diffèrent. Le dernier code désigne le type de notice « Print ».",
            "en": "Report A → the wrestlers: standalone print. Report B → the village: detached plate from a printed book. Report C → the Hiroshige album: complete printed book. All three records mention ink and colour on paper, but their documented formats differ. The final code names the record type “Print”."
          }
        ],
        "explanation": {
          "fr": "Rapport A → les lutteurs : estampe autonome. Rapport B → le village : plaque détachée d’un livre imprimé. Rapport C → l’album Hiroshige : livre imprimé complet. Les trois notices mentionnent l’encre et la couleur sur papier, mais leurs formats documentés diffèrent. Le dernier code désigne le type de notice « Print ».",
          "en": "Report A → the wrestlers: standalone print. Report B → the village: detached plate from a printed book. Report C → the Hiroshige album: complete printed book. All three records mention ink and colour on paper, but their documented formats differ. The final code names the record type “Print”."
        },
        "wrongAnswer": {
          "fr": "Au moins une association confond les formats documentés. Comparez le champ technique complet et utilisez chaque témoin une seule fois.",
          "en": "At least one match confuses documented formats. Compare the complete medium field and use each witness once."
        },
        "pieces": [
          {
            "id": "ink-lab",
            "title": {
              "fr": "Rapports d’examen documentaire",
              "en": "Documentary examination reports"
            },
            "text": {
              "fr": "Documents fictifs fondés sur les techniques publiées : A, estampe autonome à l’encre et en couleurs sur papier ; B, plaque détachée d’un livre xylographié, mêmes matériaux ; C, livre xylographié complet, mêmes matériaux. Le code de récolement recherché est « Print » dans le champ de type du Met.",
              "en": "Fictional documents based on published media: A, standalone woodblock print with ink and colour on paper; B, detached plate from a woodblock-printed book, same materials; C, complete woodblock-printed book, same materials. The missing reconciliation code is “Print” in the Met object type field."
            },
            "provenance": "fictional-document",
            "artworkIds": [
              37189,
              37193,
              78617
            ],
            "fields": [
              "medium",
              "objectName"
            ]
          }
        ],
        "clue": {
          "id": "ink-materials-clue",
          "text": {
            "fr": "Le récolement fictif exige une notice dont le champ objectName est exactement « Print ».",
            "en": "The fictional reconciliation requires a record whose objectName field is exactly “Print”."
          },
          "predicates": [
            {
              "field": "objectName",
              "operator": "equals",
              "value": "Print"
            }
          ],
          "sourcePieceId": "ink-lab"
        },
        "kind": "materials",
        "reports": [
          {
            "id": "report-a",
            "text": {
              "fr": "A · Estampe autonome ; encre et couleurs sur papier.",
              "en": "A · Standalone woodblock print; ink and colour on paper."
            },
            "predicate": {
              "field": "medium",
              "operator": "equals",
              "value": "Woodblock print; ink and color on paper"
            }
          },
          {
            "id": "report-b",
            "text": {
              "fr": "B · Plaque détachée d’un livre xylographié ; encre et couleurs sur papier.",
              "en": "B · Detached plate from a woodblock-printed book; ink and colour on paper."
            },
            "predicate": {
              "field": "medium",
              "operator": "equals",
              "value": "Detached plate from a woodblock printed book; ink and color on paper"
            }
          },
          {
            "id": "report-c",
            "text": {
              "fr": "C · Livre xylographié complet ; encre et couleurs sur papier.",
              "en": "C · Complete woodblock-printed book; ink and colour on paper."
            },
            "predicate": {
              "field": "medium",
              "operator": "equals",
              "value": "Woodblock printed book; ink and color on paper"
            }
          }
        ],
        "items": [
          {
            "id": "work-78617",
            "artworkId": 78617
          },
          {
            "id": "work-37189",
            "artworkId": 37189
          },
          {
            "id": "work-37193",
            "artworkId": 37193
          }
        ],
        "answer": {
          "report-a": "work-37189",
          "report-b": "work-37193",
          "report-c": "work-78617"
        }
      }
    ],
    "conclusion": {
      "fr": "L’œuvre recherchée est Kinryūsan Temple at Asakusa, de la série One Hundred Famous Views of Edo, attribuée à Utagawa Hiroshige et datée de 1856. Son intervalle commence après 1830 et finit au plus tard en 1856 ; son type de notice est « Print ». Azuma Bridge est trop tardif, les deux estampes de Hokusai échouent à l’attribution et à la borne de début. La grande lanterne rouge appartient bien à la reproduction, mais n’a pas servi de preuve de matériaux.",
      "en": "The missing work is Kinryūsan Temple at Asakusa, from One Hundred Famous Views of Edo, attributed to Utagawa Hiroshige and dated 1856. Its interval starts after 1830 and ends no later than 1856; its record type is “Print”. Azuma Bridge is too late, while both Hokusai prints fail the attribution and lower-date clues. The large red lantern is visible in the reproduction, but it was not used as evidence of materials."
    },
    "assistedConclusion": {
      "fr": "Reprenons le classement, les bornes et le type documentaire. L’œuvre recherchée est Kinryūsan Temple at Asakusa, de la série One Hundred Famous Views of Edo, attribuée à Utagawa Hiroshige et datée de 1856. Son intervalle commence après 1830 et finit au plus tard en 1856 ; son type de notice est « Print ». Azuma Bridge est trop tardif, les deux estampes de Hokusai échouent à l’attribution et à la borne de début. La grande lanterne rouge appartient bien à la reproduction, mais n’a pas servi de preuve de matériaux.",
      "en": "Let us revisit attribution, date bounds and documentary type. The missing work is Kinryūsan Temple at Asakusa, from One Hundred Famous Views of Edo, attributed to Utagawa Hiroshige and dated 1856. Its interval starts after 1830 and ends no later than 1856; its record type is “Print”. Azuma Bridge is too late, while both Hokusai prints fail the attribution and lower-date clues. The large red lantern is visible in the reproduction, but it was not used as evidence of materials."
    },
    "candidateExplanations": {
      "54303": {
        "fr": "Basket of Flowers with Bamboo Blind est attribué à Hokusai et son intervalle 1799–1810 commence avant 1830 ; son type est « Woodblock print ».",
        "en": "Basket of Flowers with Bamboo Blind is attributed to Hokusai and its 1799–1810 interval begins before 1830; its type is “Woodblock print”."
      },
      "37282": {
        "fr": "Azuma Bridge est daté de 1857, au-delà de 1856 ; son type de notice est « Woodblock print ».",
        "en": "Azuma Bridge is dated 1857, beyond 1856; its record type is “Woodblock print”."
      },
      "56689": {
        "fr": "Hiroshige, 1856–1856, type « Print » : les quatre indices concordent.",
        "en": "Hiroshige, 1856–1856, type “Print”: all four clues agree."
      },
      "54433": {
        "fr": "Mystical Bird est attribué à Hokusai et son intervalle 1820–1833 commence avant 1830.",
        "en": "Mystical Bird is attributed to Hokusai and its 1820–1833 interval begins before 1830."
      }
    }
  },
  {
    "id": "the-last-inventory",
    "revision": "2026-10-16.1",
    "title": {
      "fr": "Le dernier inventaire",
      "en": "The Last Inventory"
    },
    "subtitle": {
      "fr": "Trois places vides. Un objet oublié du registre.",
      "en": "Three empty slots. One object omitted from the register."
    },
    "briefing": {
      "fr": "La réserve des antiquités a fermé avant la fin du récolement. Un objet manque, et les positions d’une vitrine ont été effacées. Une photographie, deux tablettes et un constat permettent de croiser dates, matériaux et ordre de rangement. Le récolement est fictif ; les objets et leurs données proviennent du Met.",
      "en": "The antiquities store closed before reconciliation was finished. An object is missing and a display layout has been erased. A photograph, two tablets and a condition report let you combine dates, materials and arrangement. The reconciliation is fictional; the objects and data come from the Met."
    },
    "introduction": {
      "fr": "Les années anciennes sont négatives. Les énigmes comparent exclusivement les bornes numériques objectBeginDate et objectEndDate de l’API du Met ; le libellé objectDate du musée reste affiché séparément et peut différer. Il ne faut pas remplacer l’un par l’autre. Un matériau se vérifie dans la notice, pas dans la couleur de l’image.",
      "en": "Ancient years are negative. Puzzles compare only the Met API’s numeric objectBeginDate and objectEndDate bounds; the museum’s objectDate label remains separately displayed and may differ. Do not substitute one for the other. Verify material in the record, not from image colour."
    },
    "difficulty": {
      "fr": "Avancé",
      "en": "Advanced"
    },
    "estimatedMinutes": [
      10,
      15
    ],
    "accent": "stone",
    "coverArtworkId": 544498,
    "candidateIds": [
      548732,
      544121,
      545181,
      544512
    ],
    "targetArtworkId": 544512,
    "witnessIds": [
      544498,
      544752,
      548360
    ],
    "puzzles": [
      {
        "id": "inventory-fragment",
        "title": {
          "fr": "Le fragment retrouvé",
          "en": "The recovered fragment"
        },
        "prompt": {
          "fr": "Une photographie de détail a été retrouvée dans le dossier. À quelle œuvre témoin appartient-elle ?",
          "en": "A detail photograph was recovered in the file. Which witness artwork does it belong to?"
        },
        "instructions": {
          "fr": "Comparez le fragment aux trois reproductions. Sélectionnez une œuvre ; les descriptions visuelles offrent la même information que l’image.",
          "en": "Compare the fragment with the three reproductions. Select one work; the visual descriptions provide the same information as the image."
        },
        "witnessIds": [
          544498,
          544752,
          548360
        ],
        "hints": [
          {
            "fr": "Comparez les formes et les objets, pas seulement les couleurs.",
            "en": "Compare shapes and objects, not only colours."
          },
          {
            "fr": "Deux mains bleues tiennent deux petits récipients arrondis au-dessus d’un socle rectangulaire.",
            "en": "Two blue hands hold two small rounded vessels above a rectangular base."
          },
          {
            "fr": "Le détail et la description concordent uniquement avec Sphinx of Amenhotep III, possibly from a Model of a Temple. La note fictive associée livre un indice sur l’œuvre disparue.",
            "en": "The detail and description match only Sphinx of Amenhotep III, possibly from a Model of a Temple. The associated fictional note provides a clue about the missing work."
          }
        ],
        "explanation": {
          "fr": "Le détail et la description concordent uniquement avec Sphinx of Amenhotep III, possibly from a Model of a Temple. La note fictive associée livre un indice sur l’œuvre disparue.",
          "en": "The detail and description match only Sphinx of Amenhotep III, possibly from a Model of a Temple. The associated fictional note provides a clue about the missing work."
        },
        "wrongAnswer": {
          "fr": "Le détail ne correspond pas à cette reproduction. Comparez les objets, contours et gestes avec la description du fragment.",
          "en": "The detail does not match this reproduction. Compare its objects, outlines and gestures with the fragment description."
        },
        "pieces": [
          {
            "id": "inventory-photo",
            "title": {
              "fr": "Photographie de la vitrine",
              "en": "Display-case photograph"
            },
            "text": {
              "fr": "Document fictif : « Reconnaître le témoin photographié pour retrouver la tablette de stockage : début de datation, −1500 ou après. » Les mains et les récipients sont des détails visibles du témoin.",
              "en": "Fictional document: “Identify the photographed witness to recover the storage tablet: date interval begins in −1500 or later.” The hands and vessels are visible details of the witness."
            },
            "provenance": "fictional-document",
            "artworkIds": [
              544498,
              544752,
              548360
            ],
            "fields": [
              "objectBeginDate"
            ]
          }
        ],
        "clue": {
          "id": "inventory-fragment-clue",
          "text": {
            "fr": "La fiche fictive de stockage exige que la borne de début de l’objet disparu soit égale ou postérieure à −1500.",
            "en": "The fictional storage sheet requires the missing object’s start bound to be −1500 or later."
          },
          "predicates": [
            {
              "field": "objectBeginDate",
              "operator": "at-least",
              "value": -1500
            }
          ],
          "sourcePieceId": "inventory-photo"
        },
        "kind": "fragment",
        "fragment": {
          "artworkId": 544498,
          "path": "/artworks/fragment-544498.webp",
          "crop": {
            "x": 0.42,
            "y": 0.48,
            "width": 0.42,
            "height": 0.21
          },
          "alt": {
            "fr": "Deux mains bleues tiennent deux petits récipients arrondis au-dessus d’un socle rectangulaire.",
            "en": "Two blue hands hold two small rounded vessels above a rectangular base."
          },
          "observation": {
            "fr": "Deux mains bleues tiennent deux petits récipients arrondis au-dessus d’un socle rectangulaire.",
            "en": "Two blue hands hold two small rounded vessels above a rectangular base."
          }
        },
        "options": [
          {
            "id": "work-544498",
            "artworkId": 544498,
            "observation": {
              "fr": "Sphinx bleu portant deux petits vases devant lui.",
              "en": "Blue sphinx holding two small vessels before it."
            }
          },
          {
            "id": "work-544752",
            "artworkId": 544752,
            "observation": {
              "fr": "Tête royale en pierre brune portant une haute couronne.",
              "en": "Royal head in brown stone wearing a tall crown."
            }
          },
          {
            "id": "work-548360",
            "artworkId": 548360,
            "observation": {
              "fr": "Torse de statue sombre, sans tête, sur un socle.",
              "en": "Headless dark statue torso on a plinth."
            }
          }
        ],
        "answer": "work-544498"
      },
      {
        "id": "inventory-chronology",
        "title": {
          "fr": "Les archives chronologiques",
          "en": "The chronological archive"
        },
        "prompt": {
          "fr": "Rétablissez l’ordre de création des œuvres témoins, de la plus ancienne à la plus récente.",
          "en": "Restore the witness works from earliest to latest creation."
        },
        "instructions": {
          "fr": "Consultez les bornes numériques objectBeginDate et objectEndDate de l’API du Met, affichées dans le dossier. Déplacez chaque carte à sa position ; la fin d’un intervalle doit précéder le début du suivant. Le libellé de date du musée est conservé séparément et peut différer. Les années négatives précèdent notre ère.",
          "en": "Consult the Met API’s numeric objectBeginDate and objectEndDate bounds displayed in the dossier. Move each card into position; each interval must end before the next begins. The museum’s display-date text is retained separately and may differ. Negative years are BCE."
        },
        "witnessIds": [
          544498,
          544752,
          548360
        ],
        "hints": [
          {
            "fr": "Une date approximative est un intervalle, pas une année exacte.",
            "en": "An approximate date is an interval, not an exact year."
          },
          {
            "fr": "Commencez par l’œuvre dont la borne de fin est la plus ancienne.",
            "en": "Start with the work whose end bound is earliest."
          },
          {
            "fr": "L’ordre est Sphinx of Amenhotep III, possibly from a Model of a Temple (-1390–-1352) → Head of King Seti II Wearing the Blue Crown (-1200–-1194) → Torso of a High General (-399–-300). La fin de chaque intervalle précède le début du suivant ; aucune année médiane n’est inventée.",
            "en": "The order is Sphinx of Amenhotep III, possibly from a Model of a Temple (-1390–-1352) → Head of King Seti II Wearing the Blue Crown (-1200–-1194) → Torso of a High General (-399–-300). Each interval ends before the next begins; no midpoint year is invented."
          }
        ],
        "explanation": {
          "fr": "L’ordre est Sphinx of Amenhotep III, possibly from a Model of a Temple (-1390–-1352) → Head of King Seti II Wearing the Blue Crown (-1200–-1194) → Torso of a High General (-399–-300). La fin de chaque intervalle précède le début du suivant ; aucune année médiane n’est inventée.",
          "en": "The order is Sphinx of Amenhotep III, possibly from a Model of a Temple (-1390–-1352) → Head of King Seti II Wearing the Blue Crown (-1200–-1194) → Torso of a High General (-399–-300). Each interval ends before the next begins; no midpoint year is invented."
        },
        "wrongAnswer": {
          "fr": "Cet ordre ne respecte pas tous les intervalles. La borne de fin de chaque œuvre doit précéder la borne de début de la suivante.",
          "en": "This order does not respect every interval. Each work’s end bound must precede the next work’s start bound."
        },
        "pieces": [
          {
            "id": "inventory-tablet",
            "title": {
              "fr": "Tablette des transferts",
              "en": "Transfer tablet"
            },
            "text": {
              "fr": "Document fictif : « Ranger les témoins du plus ancien au plus récent. Pour l’objet disparu, la borne de fin est −1352 ou antérieure. » Une année plus négative est plus ancienne : −1390 précède −1200.",
              "en": "Fictional document: “Arrange witnesses from earliest to latest. For the missing object, the end bound is −1352 or earlier.” A more negative year is earlier: −1390 precedes −1200."
            },
            "provenance": "fictional-document",
            "artworkIds": [
              544498,
              544752,
              548360
            ],
            "fields": [
              "objectBeginDate",
              "objectEndDate"
            ]
          }
        ],
        "clue": {
          "id": "inventory-chronology-clue",
          "text": {
            "fr": "La tablette fictive impose une borne de fin égale ou antérieure à −1352.",
            "en": "The fictional tablet requires an end bound of −1352 or earlier."
          },
          "predicates": [
            {
              "field": "objectEndDate",
              "operator": "at-most",
              "value": -1352
            }
          ],
          "sourcePieceId": "inventory-tablet"
        },
        "kind": "chronology",
        "items": [
          {
            "id": "work-548360",
            "artworkId": 548360
          },
          {
            "id": "work-544752",
            "artworkId": 544752
          },
          {
            "id": "work-544498",
            "artworkId": 544498
          }
        ],
        "answer": [
          "work-544498",
          "work-544752",
          "work-548360"
        ]
      },
      {
        "id": "inventory-report",
        "title": {
          "fr": "Le rapport contradictoire",
          "en": "The contradictory report"
        },
        "prompt": {
          "fr": "Une seule affirmation de ce rapport fictif contredit une donnée présente dans les fiches du Met. Laquelle ?",
          "en": "Exactly one statement in this fictional report contradicts a documented Met field. Which one?"
        },
        "instructions": {
          "fr": "Ouvrez les fiches témoins et confrontez les affirmations aux champs indiqués. Une information absente ne constitue jamais une contradiction.",
          "en": "Open the witness records and compare each statement with its named field. Missing information is never a contradiction."
        },
        "witnessIds": [
          544498,
          544752,
          548360
        ],
        "hints": [
          {
            "fr": "Vérifiez les champs nommés dans le rapport.",
            "en": "Check the fields named in the report."
          },
          {
            "fr": "Les supports et les bornes de dates sont des preuves ; l’absence d’un nom d’artiste n’en est pas une.",
            "en": "Supports and date bounds are evidence; an absent artist name is not."
          },
          {
            "fr": "Le sphinx est documenté en faïence, avec les restes d’un tenon en travertin, et non en bronze. La tête est en quartzite avec peinture ; le torse est en métagrauwacke. Aucun nom d’artiste absent n’est utilisé comme preuve.",
            "en": "The sphinx is documented as faience with remains of a travertine tenon, not bronze. The head is quartzite with paint; the torso is metagraywacke. No absent artist name is used as evidence."
          }
        ],
        "explanation": {
          "fr": "Le sphinx est documenté en faïence, avec les restes d’un tenon en travertin, et non en bronze. La tête est en quartzite avec peinture ; le torse est en métagrauwacke. Aucun nom d’artiste absent n’est utilisé comme preuve.",
          "en": "The sphinx is documented as faience with remains of a travertine tenon, not bronze. The head is quartzite with paint; the torso is metagraywacke. No absent artist name is used as evidence."
        },
        "wrongAnswer": {
          "fr": "Cette affirmation concorde avec un champ documenté. Cherchez celle qui est réfutée par une donnée présente, pas par une information manquante.",
          "en": "This statement agrees with a documented field. Look for one disproved by a present value, not by missing information."
        },
        "pieces": [
          {
            "id": "inventory-report-piece",
            "title": {
              "fr": "Constat de la réserve",
              "en": "Store-room condition report"
            },
            "text": {
              "fr": "Document fictif : comparer trois affirmations de matériaux aux notices. Le code corrigé exige que le champ medium de l’objet disparu soit exactement « Faience ». Il ne permet pas de déduire un matériau de sa couleur.",
              "en": "Fictional document: compare three material statements with the records. The corrected code requires the missing object’s medium field to be exactly “Faience”. It does not infer material from colour."
            },
            "provenance": "fictional-document",
            "artworkIds": [
              544498,
              544752,
              548360
            ],
            "fields": [
              "medium"
            ]
          }
        ],
        "clue": {
          "id": "inventory-report-clue",
          "text": {
            "fr": "La correction du rapport fictif indique le matériau exact de l’objet disparu : « Faience », sans matériau supplémentaire dans ce champ.",
            "en": "The corrected fictional report gives the missing object’s exact medium: “Faience”, with no additional material in that field."
          },
          "predicates": [
            {
              "field": "medium",
              "operator": "equals",
              "value": "Faience"
            }
          ],
          "sourcePieceId": "inventory-report-piece"
        },
        "kind": "contradiction",
        "statements": [
          {
            "id": "sphinx-bronze",
            "artworkId": 544498,
            "text": {
              "fr": "Le sphinx est documenté en bronze.",
              "en": "The sphinx is documented as bronze."
            },
            "assertion": {
              "field": "medium",
              "operator": "contains",
              "value": "bronze"
            }
          },
          {
            "id": "head-quartzite",
            "artworkId": 544752,
            "text": {
              "fr": "La tête royale est documentée en quartzite avec peinture.",
              "en": "The royal head is documented as quartzite with paint."
            },
            "assertion": {
              "field": "medium",
              "operator": "equals",
              "value": "Quartzite, paint"
            }
          },
          {
            "id": "torso-stone",
            "artworkId": 548360,
            "text": {
              "fr": "Le torse est documenté en métagrauwacke.",
              "en": "The torso is documented as metagraywacke."
            },
            "assertion": {
              "field": "medium",
              "operator": "equals",
              "value": "Metagraywacke"
            }
          }
        ],
        "answer": "sphinx-bronze"
      },
      {
        "id": "inventory-arrangement",
        "title": {
          "fr": "Le dernier inventaire",
          "en": "The last inventory"
        },
        "prompt": {
          "fr": "Reconstituez les trois places de la vitrine à partir des consignes du registre fictif. Les positions sont des éléments du scénario, pas des faits archéologiques.",
          "en": "Reconstruct the three display positions using the fictional register instructions. Positions belong to the story, not to archaeological fact."
        },
        "instructions": {
          "fr": "De gauche à droite : places I, II et III. Utilisez chaque témoin exactement une fois et respectez les trois contraintes affichées.",
          "en": "From left to right: slots I, II and III. Use each witness exactly once and satisfy all three displayed constraints."
        },
        "witnessIds": [
          544498,
          544752,
          548360
        ],
        "hints": [
          {
            "fr": "Croisez les contraintes avant de placer un objet. « Avant » signifie à gauche, pas nécessairement juste à côté.",
            "en": "Combine constraints before placing an object. “Before” means to the left, not necessarily immediately next to it."
          },
          {
            "fr": "La tête ne peut être première, car le sphinx doit la précéder ; elle ne peut pas être dernière non plus.",
            "en": "The head cannot be first because the sphinx must precede it; it cannot be last either."
          },
          {
            "fr": "Le sphinx précède la tête. La tête ne peut être ni dernière ni première : elle est donc au milieu. Le torse, adjacent à la tête, prend la dernière place. L’unique disposition est sphinx → tête → torse. La légende fictive de la dernière case donne la borne de fin minimale −1400.",
            "en": "The sphinx precedes the head. The head can be neither last nor first, so it is in the middle. The torso, adjacent to the head, takes the last place. The only arrangement is sphinx → head → torso. The fictional final-slot legend gives the minimum end bound −1400."
          }
        ],
        "explanation": {
          "fr": "Le sphinx précède la tête. La tête ne peut être ni dernière ni première : elle est donc au milieu. Le torse, adjacent à la tête, prend la dernière place. L’unique disposition est sphinx → tête → torse. La légende fictive de la dernière case donne la borne de fin minimale −1400.",
          "en": "The sphinx precedes the head. The head can be neither last nor first, so it is in the middle. The torso, adjacent to the head, takes the last place. The only arrangement is sphinx → head → torso. The fictional final-slot legend gives the minimum end bound −1400."
        },
        "wrongAnswer": {
          "fr": "Au moins une contrainte de position n’est pas respectée. Vérifiez ensemble l’ordre relatif, le voisinage et la place interdite.",
          "en": "At least one position constraint is not satisfied. Check relative order, adjacency and the forbidden slot together."
        },
        "pieces": [
          {
            "id": "inventory-layout",
            "title": {
              "fr": "Plan de récolement",
              "en": "Reconciliation layout"
            },
            "text": {
              "fr": "Document fictif : le sphinx précède la tête ; la tête est à côté du torse ; la tête n’occupe pas la place III. Une fois le plan rétabli, la légende indique : « Objet disparu : fin de datation −1400 ou après. »",
              "en": "Fictional document: the sphinx precedes the head; the head is next to the torso; the head does not occupy slot III. Once the plan is restored, its legend says: “Missing object: end date −1400 or later.”"
            },
            "provenance": "fictional-document",
            "artworkIds": [
              544498,
              544752,
              548360
            ],
            "fields": [
              "objectEndDate"
            ]
          }
        ],
        "clue": {
          "id": "inventory-arrangement-clue",
          "text": {
            "fr": "La légende fictive de la vitrine exige une borne de fin égale ou postérieure à −1400.",
            "en": "The fictional display legend requires an end bound of −1400 or later."
          },
          "predicates": [
            {
              "field": "objectEndDate",
              "operator": "at-least",
              "value": -1400
            }
          ],
          "sourcePieceId": "inventory-layout"
        },
        "kind": "inventory",
        "items": [
          {
            "id": "work-548360",
            "artworkId": 548360
          },
          {
            "id": "work-544498",
            "artworkId": 544498
          },
          {
            "id": "work-544752",
            "artworkId": 544752
          }
        ],
        "slots": [
          {
            "id": "slot-i",
            "label": {
              "fr": "I · Gauche",
              "en": "I · Left"
            }
          },
          {
            "id": "slot-ii",
            "label": {
              "fr": "II · Milieu",
              "en": "II · Middle"
            }
          },
          {
            "id": "slot-iii",
            "label": {
              "fr": "III · Droite",
              "en": "III · Right"
            }
          }
        ],
        "constraints": [
          {
            "kind": "before",
            "left": "work-544498",
            "right": "work-544752"
          },
          {
            "kind": "adjacent",
            "left": "work-544752",
            "right": "work-548360"
          },
          {
            "kind": "not-at",
            "itemId": "work-544752",
            "position": 2
          }
        ],
        "constraintText": [
          {
            "fr": "Le sphinx précède la tête royale.",
            "en": "The sphinx precedes the royal head."
          },
          {
            "fr": "La tête royale est à côté du torse.",
            "en": "The royal head is next to the torso."
          },
          {
            "fr": "La tête royale n’occupe pas la place III.",
            "en": "The royal head does not occupy slot III."
          }
        ],
        "answer": [
          "work-544498",
          "work-544752",
          "work-548360"
        ]
      }
    ],
    "conclusion": {
      "fr": "L’objet disparu est Kohl Tube Inscribed for Amenhotep III and Princess Sitamun, un tube à khôl en faïence. Ses bornes numériques dans l’API du Met sont −1390 et −1352 ; le libellé original du musée est « ca. 1386–1347 BCE ». Les indices du dossier portent explicitement sur les bornes de l’API, pas sur ce libellé. Cobra Head a une borne de fin trop tardive ; le collier et le bracelet de cheville échouent aux bornes ou au matériau exact, qui inclut aussi du lin. Aucun artiste n’est inventé pour les attributions absentes.",
      "en": "The missing object is Kohl Tube Inscribed for Amenhotep III and Princess Sitamun, a faience kohl tube. Its numeric Met API bounds are −1390 and −1352; the museum’s original display label is “ca. 1386–1347 BCE”. The dossier clues explicitly concern the API bounds, not that label. Cobra Head has an end bound that is too late; the necklace and anklet fail the bounds or exact-medium clues, since their media also include linen. No artist is invented for absent attributions."
    },
    "assistedConclusion": {
      "fr": "Suivons ensemble les contraintes du registre. L’objet disparu est Kohl Tube Inscribed for Amenhotep III and Princess Sitamun, un tube à khôl en faïence. Ses bornes numériques dans l’API du Met sont −1390 et −1352 ; le libellé original du musée est « ca. 1386–1347 BCE ». Les indices du dossier portent explicitement sur les bornes de l’API, pas sur ce libellé. Cobra Head a une borne de fin trop tardive ; le collier et le bracelet de cheville échouent aux bornes ou au matériau exact, qui inclut aussi du lin. Aucun artiste n’est inventé pour les attributions absentes.",
      "en": "Let us follow the register constraints together. The missing object is Kohl Tube Inscribed for Amenhotep III and Princess Sitamun, a faience kohl tube. Its numeric Met API bounds are −1390 and −1352; the museum’s original display label is “ca. 1386–1347 BCE”. The dossier clues explicitly concern the API bounds, not that label. Cobra Head has an end bound that is too late; the necklace and anklet fail the bounds or exact-medium clues, since their media also include linen. No artist is invented for absent attributions."
    },
    "candidateExplanations": {
      "548732": {
        "fr": "La borne de fin numérique du collier est −1492 dans l’API, avant −1400 ; son libellé musée « ca. 1491–1473 BCE » est conservé séparément. Le matériau inclut une corde de lin.",
        "en": "The necklace’s numeric API end bound is −1492, before −1400; its museum label “ca. 1491–1473 BCE” is retained separately. Its medium includes linen cord."
      },
      "544121": {
        "fr": "Les bornes API de Cobra Head sont −1400 et −1300 : la fin dépasse −1352. Ne remplacez pas cet intervalle par une année médiane.",
        "en": "Cobra Head’s API bounds are −1400 and −1300: the end exceeds −1352. Do not replace the interval with a midpoint year."
      },
      "545181": {
        "fr": "La borne de début API de l’Anklet of Wah est −1981, avant −1500, et sa borne de fin précède −1400. Le matériau inclut du fil de lin.",
        "en": "Anklet of Wah’s API start bound is −1981, before −1500, and its end bound precedes −1400. Its medium includes linen thread."
      },
      "544512": {
        "fr": "Faïence seule, bornes API −1390 et −1352 : cet objet satisfait les quatre contraintes numériques et matérielles.",
        "en": "Faience alone, API bounds −1390 and −1352: this object satisfies all four numeric and material constraints."
      }
    }
  }
] as const satisfies readonly CaseDefinition[];
