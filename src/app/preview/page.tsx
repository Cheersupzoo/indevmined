import { Metadata } from 'next'

import { AnyExtension, getSchema } from '@tiptap/core'
import { Node } from '@tiptap/pm/model'

import Layout, { NormalResponsive } from '@/components/Layout'
import '@/styles/markdown.css'

import { staticMarkExtensions } from '../editor/extensions/marks/staticMark'
import { staticNodeExtensions } from '../editor/extensions/nodes/staticNodes'
import { NodeRenderer } from './Renderer'

export const metadata: Metadata = {
  title: 'Preview | In Dev Mined',
  description: 'In Dev Mined WYSIWYG Editor',
}

const extensions = [...staticNodeExtensions, ...staticMarkExtensions]
const nodeExtensionKV = staticNodeExtensions.reduce(
  (prev, cur) => {
    prev[cur.name] = cur

    return prev
  },
  {} as Record<string, AnyExtension>
)
const schema = getSchema(extensions)

export default async function PreviewPage() {
  const contentNode = Node.fromJSON(schema, json)
  const children: React.ReactElement[] = []
  contentNode.content.forEach((node, index) => {
    children.push(
      <NodeRenderer key={index} node={node} nodeExtensionKV={nodeExtensionKV} />
    )
  })

  return (
    <Layout>
      <NormalResponsive>
        <div className='markdown-body text-eva-text'>{children}</div>
      </NormalResponsive>
    </Layout>
  )
}

const json = {
  "type": "doc",
  "content": [
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 2
          },
          "content": [
              {
                  "type": "text",
                  "text": "What is Position?"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Well, it should be a general word but if you are not sure feel free to look in "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "link",
                          "attrs": {
                              "href": "https://dictionary.cambridge.org/dictionary/english/position",
                              "target": "_blank",
                              "rel": "noopener noreferrer nofollow",
                              "class": null
                          }
                      }
                  ],
                  "text": "dictionary"
              },
              {
                  "type": "text",
                  "text": ". Here we are talking about the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "italic"
                      },
                      {
                          "type": "playful"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "Position"
              },
              {
                  "type": "text",
                  "text": " mention in "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "link",
                          "attrs": {
                              "href": "https://tiptap.dev/product/editor",
                              "target": "_blank",
                              "rel": "noopener noreferrer nofollow",
                              "class": null
                          }
                      }
                  ],
                  "text": "Tiptap"
              },
              {
                  "type": "text",
                  "text": " or "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "link",
                          "attrs": {
                              "href": "https://prosemirror.net/",
                              "target": "_blank",
                              "rel": "noopener noreferrer nofollow",
                              "class": null
                          }
                      }
                  ],
                  "text": "ProseMirror"
              },
              {
                  "type": "text",
                  "text": "."
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Generally, it is referred to the place where your text cursor, this vertical link that usually blinking  → "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "animation",
                          "attrs": {
                              "type": "blinking"
                          }
                      }
                  ],
                  "text": "|"
              },
              {
                  "type": "text",
                  "text": ", when editing a text."
              }
          ]
      },
      {
          "type": "image",
          "attrs": {
              "src": "https://cdn.indevmined.com/image/1750754259834-17fe9c0b-38bd-4ba0-85fc-3a75588f18c6.gif",
              "alt": "cursor-blinking-ezgif.com-video-to-gif-converter",
              "title": "cursor-blinking-ezgif.com-video-to-gif-converter",
              "width": null
          }
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "So, as you can see, the text cursor stay between the text. The "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "italic"
                      },
                      {
                          "type": "playful"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "position"
              },
              {
                  "type": "text",
                  "text": " alone didn’t represent the location of the text directly, but it could tell if the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "italic"
                      },
                      {
                          "type": "playful"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "position"
              },
              {
                  "type": "text",
                  "text": " is just right before or after the text. And to tell which text you want, or as the term "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "playful"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "selection"
              },
              {
                  "type": "text",
                  "text": ", is a pair of "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "italic"
                      },
                      {
                          "type": "playful"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "position"
              },
              {
                  "type": "text",
                  "text": " that clamp between the selected text. "
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "The same word apply for "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "italic"
                      },
                      {
                          "type": "playful"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "position"
              },
              {
                  "type": "text",
                  "text": " of a node, mark, decoration."
              }
          ]
      },
      {
          "type": "blockquote",
          "content": [
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "From this point on we will refer “"
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "bold"
                              },
                              {
                                  "type": "italic"
                              },
                              {
                                  "type": "playful"
                              },
                              {
                                  "type": "textDecorationMark",
                                  "attrs": {
                                      "num": 4,
                                      "isBg": false
                                  }
                              }
                          ],
                          "text": "position"
                      },
                      {
                          "type": "text",
                          "text": "” with "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "bold"
                              },
                              {
                                  "type": "textDecorationMark",
                                  "attrs": {
                                      "num": 4,
                                      "isBg": false
                                  }
                              }
                          ],
                          "text": "pos"
                      },
                      {
                          "type": "text",
                          "text": ". And the "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "link",
                                  "attrs": {
                                      "href": "https://tiptap.dev/product/editor",
                                      "target": "_blank",
                                      "rel": "noopener noreferrer nofollow",
                                      "class": null
                                  }
                              }
                          ],
                          "text": "Tiptap"
                      },
                      {
                          "type": "text",
                          "text": " or "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "link",
                                  "attrs": {
                                      "href": "https://prosemirror.net/",
                                      "target": "_blank",
                                      "rel": "noopener noreferrer nofollow",
                                      "class": null
                                  }
                              }
                          ],
                          "text": "ProseMirror"
                      },
                      {
                          "type": "text",
                          "text": " as the editor"
                      }
                  ]
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "So, how "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " is identified in the editor? See it for yourself. Here is the editor with decoration showing all the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": "."
              }
          ]
      },
      {
          "type": "debugEditor",
          "attrs": {
              "type": 4
          }
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          }
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Once you know how to identify "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": ", the next step would be utilizing them."
              }
          ]
      },
      {
          "type": "blockquote",
          "content": [
              {
                  "type": "heading",
                  "attrs": {
                      "id": null,
                      "level": 3
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "Before we continue"
                      }
                  ]
              },
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "It is recommended to at least try to "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "link",
                                  "attrs": {
                                      "href": "https://tiptap.dev/docs/editor/getting-started/install",
                                      "target": "_blank",
                                      "rel": "noopener noreferrer nofollow",
                                      "class": null
                                  }
                              }
                          ],
                          "text": "set up Tiptap editor"
                      },
                      {
                          "type": "text",
                          "text": " once before continue this tutorial."
                      }
                  ]
              },
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "You should at least heard about ProseMirror Editor but here is a quick recap:"
                      }
                  ]
              },
              {
                  "type": "bulletList",
                  "content": [
                      {
                          "type": "listItem",
                          "content": [
                              {
                                  "type": "paragraph",
                                  "attrs": {
                                      "id": null
                                  },
                                  "content": [
                                      {
                                          "type": "text",
                                          "marks": [
                                              {
                                                  "type": "link",
                                                  "attrs": {
                                                      "href": "https://prosemirror.net/docs/ref/#model",
                                                      "target": "_blank",
                                                      "rel": "noopener noreferrer nofollow",
                                                      "class": null
                                                  }
                                              }
                                          ],
                                          "text": "Model"
                                      },
                                      {
                                          "type": "text",
                                          "text": " - Defining structure of node, mark, doc"
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "type": "listItem",
                          "content": [
                              {
                                  "type": "paragraph",
                                  "attrs": {
                                      "id": null
                                  },
                                  "content": [
                                      {
                                          "type": "text",
                                          "marks": [
                                              {
                                                  "type": "link",
                                                  "attrs": {
                                                      "href": "https://prosemirror.net/docs/ref/#state",
                                                      "target": "_blank",
                                                      "rel": "noopener noreferrer nofollow",
                                                      "class": null
                                                  }
                                              }
                                          ],
                                          "text": "State"
                                      },
                                      {
                                          "type": "text",
                                          "text": " - Source of truth of your editor, usually contain the array of nodes and selection"
                                      }
                                  ]
                              }
                          ]
                      },
                      {
                          "type": "listItem",
                          "content": [
                              {
                                  "type": "paragraph",
                                  "attrs": {
                                      "id": null
                                  },
                                  "content": [
                                      {
                                          "type": "text",
                                          "marks": [
                                              {
                                                  "type": "link",
                                                  "attrs": {
                                                      "href": "https://prosemirror.net/docs/ref/#state.Transaction",
                                                      "target": "_blank",
                                                      "rel": "noopener noreferrer nofollow",
                                                      "class": null
                                                  }
                                              }
                                          ],
                                          "text": "Transaction"
                                      },
                                      {
                                          "type": "text",
                                          "text": " - Set of actions to mutate the state"
                                      }
                                  ]
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "For this tutorial, you don’t need to familiar with the "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "link",
                                  "attrs": {
                                      "href": "https://prosemirror.net/docs/ref/#view",
                                      "target": "_blank",
                                      "rel": "noopener noreferrer nofollow",
                                      "class": null
                                  }
                              }
                          ],
                          "text": "View"
                      },
                      {
                          "type": "text",
                          "text": " since we will use a simplify version of it, just enough to show the structure of the State."
                      }
                  ]
              },
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "And to be generalise, we will focus more on ProseMirror API than Tiptap API so you could freely able to utilise the editor."
                      }
                  ]
              }
          ]
      },
      {
          "type": "horizontalRule"
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 2
          },
          "content": [
              {
                  "type": "text",
                  "text": "Why need the position?"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "The "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " allow us to know where to interact with the editor. Interaction like insert text, delete node, apply mark, add decoration, or even typing keyboard and the character showing on the editor is required of "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": ". "
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "You might have not aware, but the default setting coming with the editor has handled it for you by using position from the current selection to provide where to apply the transaction."
              }
          ]
      },
      {
          "type": "horizontalRule"
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 2
          },
          "content": [
              {
                  "type": "text",
                  "text": "How to use the position?"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Let’s divide into 2 parts:"
              }
          ]
      },
      {
          "type": "bulletList",
          "content": [
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Getting the "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Applying the "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 3
          },
          "content": [
              {
                  "type": "text",
                  "text": "Getting the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "The most common place to get "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " is from the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 2,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "selection"
              },
              {
                  "type": "text",
                  "text": " (where the cursor is showing "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "animation",
                          "attrs": {
                              "type": "blinking"
                          }
                      }
                  ],
                  "text": "|"
              },
              {
                  "type": "text",
                  "text": " or "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 5,
                              "isBg": true
                          }
                      }
                  ],
                  "text": "highlight text"
              },
              {
                  "type": "text",
                  "text": ") and from "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 2,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "coordinate XY"
              },
              {
                  "type": "text",
                  "text": " (where mouse click or touch press)"
              }
          ]
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 4
          },
          "content": [
              {
                  "type": "text",
                  "text": "From "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 2,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "Selection"
              }
          ]
      },
      {
          "type": "codeBlock",
          "attrs": {
              "id": null,
              "language": "js",
              "lineMark": [],
              "preview": null,
              "previewCenter": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "// Asuming you already have `state`, this dependon how you setup\nconst state = editor.state // or `editor.view.state` or `view.state`\n// if didn't make text selection this will equal state.selection.to\nconst "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "highlightMark",
                          "attrs": {
                              "color": "gold"
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " = state."
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "highlightMark",
                          "attrs": {
                              "color": "red"
                          }
                      }
                  ],
                  "text": "selection"
              },
              {
                  "type": "text",
                  "text": ".from "
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          }
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 4
          },
          "content": [
              {
                  "type": "text",
                  "text": "From "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 2,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "Coordinate XY"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Let assume that you want to know the get "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " in the editor related to where mouse is hovered on. For example, to decide where to show drag handle like in Notion. You can get them from editor’s view"
              }
          ]
      },
      {
          "type": "codeBlock",
          "attrs": {
              "id": "posAtCoords",
              "language": "javascript",
              "lineMark": [
                  5,
                  7,
                  6,
                  8
              ],
              "preview": null,
              "previewCenter": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "// Depend on where you wish to detect the mouse, you might\n// use `editor.view.dom.addEventListener` or\n// `editor.options.element.addEventListener` or\ndocument.addEventListener('mousemove', (event) => {\n  const "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "highlightMark",
                          "attrs": {
                              "color": "gold"
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " = view."
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "highlightMark",
                          "attrs": {
                              "color": "red"
                          }
                      }
                  ],
                  "text": "posAtCoords"
              },
              {
                  "type": "text",
                  "text": "({ // where the XY -> pos happen\n    left: event.clientX,\n    top: event.clientY,\n  })\n})"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "After able to get a "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": ", it is time to use them, but often any "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " isn’t useful enough. It is common to resolve a "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " into the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " that we can make use of, such as the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " before/after the node or the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " at the start/end of the node. "
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "And so let’s find how "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " related to the node in the doc by using "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "resolve"
              },
              {
                  "type": "text",
                  "text": " to get  "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "ResolvedPos"
              },
              {
                  "type": "text",
                  "text": "."
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          }
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 4
          },
          "content": [
              {
                  "type": "text",
                  "text": "Resolve the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Instead of calculate everything ourselves, ProseMirror provided us a function to handle them on the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "link",
                          "attrs": {
                              "href": "https://prosemirror.net/docs/ref/#model.Node",
                              "target": "_blank",
                              "rel": "noopener noreferrer nofollow",
                              "class": null
                          }
                      }
                  ],
                  "text": "Node"
              },
              {
                  "type": "text",
                  "text": " of the Model. And since the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " we got from the above are related to whole document or the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "state.doc"
              },
              {
                  "type": "text",
                  "text": " so we should resolve the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " in perspective to the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "doc"
              },
              {
                  "type": "text",
                  "text": " to get "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "link",
                          "attrs": {
                              "href": "https://prosemirror.net/docs/ref/#model.ResolvedPos",
                              "target": "_blank",
                              "rel": "noopener noreferrer nofollow",
                              "class": null
                          }
                      }
                  ],
                  "text": "ResolvedPos"
              },
              {
                  "type": "text",
                  "text": "."
              }
          ]
      },
      {
          "type": "codeBlock",
          "attrs": {
              "id": null,
              "language": "javascript",
              "lineMark": [],
              "preview": null,
              "previewCenter": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "const state = editor.state // assuming you have a state\nconst resolvedPos = state."
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "highlightMark",
                          "attrs": {
                              "color": "gold"
                          }
                      }
                  ],
                  "text": "doc"
              },
              {
                  "type": "text",
                  "text": ".resolve(pos)\n// getting the pos related to the node that pos located inside\nresolvedPos.before() // the pos before the node\nresolvedPos.after() // the pos after the node\nresolvedPos.start() // the pos at the start of node\nresolvedPos.end() // the pos before the end of node"
              }
          ]
      },
      {
          "type": "blockquote",
          "content": [
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "You might notice that these "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "code"
                              }
                          ],
                          "text": "before"
                      },
                      {
                          "type": "text",
                          "text": " "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "code"
                              }
                          ],
                          "text": "after"
                      },
                      {
                          "type": "text",
                          "text": " "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "code"
                              }
                          ],
                          "text": "start"
                      },
                      {
                          "type": "text",
                          "text": " "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "code"
                              }
                          ],
                          "text": "end"
                      },
                      {
                          "type": "text",
                          "text": " function accept optional parameter "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "code"
                              }
                          ],
                          "text": "depth"
                      },
                      {
                          "type": "text",
                          "text": " as well. Let’s discuss them later"
                      }
                  ]
              }
          ]
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 3
          },
          "content": [
              {
                  "type": "text",
                  "text": "Applying the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "After we get the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": ", and not just any "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " but also the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " that have related to the node. We can make use of them. "
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Let’s learn by examples. Here is the Schema definition for our example:"
              }
          ]
      },
      {
          "type": "codeBlock",
          "attrs": {
              "id": null,
              "language": "javascript",
              "lineMark": [
                  2,
                  5,
                  10,
                  16
              ],
              "preview": null,
              "previewCenter": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "export const schema = {\n  doc: {\n    content: \"block+\", // can only contain `paragraph` and `blockquote`\n  },\n  paragraph: {\n    content: \"inline*\", // can only contain `text`\n    group: \"block\",\n    ...\n  },\n  blockquote: {\n    // can only contain `paragraph` and `blockquote`, similar to doc\n    content: \"block+\", \n    group: \"block\",\n    ...\n  },\n  text: {\n    group: \"inline\", // contain the text\n  },\n};\n"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "There are 4 node types: "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "doc"
              },
              {
                  "type": "text",
                  "text": " "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "paragraph"
              },
              {
                  "type": "text",
                  "text": " "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "blockquote"
              },
              {
                  "type": "text",
                  "text": " "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "text"
              },
              {
                  "type": "text",
                  "text": " "
              }
          ]
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 4
          },
          "content": [
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 3,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "1st Example: Insert Text"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Let start simple by understanding how "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "insertText"
              },
              {
                  "type": "text",
                  "text": " work. You might encounter this a lot when you're typing or programmatically handle paste or inserting text from Generative AI"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "To execute "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "insertText"
              },
              {
                  "type": "text",
                  "text": ", supplying the text you need, for example ‘"
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      }
                  ],
                  "text": "world"
              },
              {
                  "type": "text",
                  "text": "’ and the position "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " you wish to insert."
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Try the example below, move the cursor to try different "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " and click “Apply” to see the result of "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "insertText"
              },
              {
                  "type": "text",
                  "text": ". (Since the total doc size is 8, so you can set "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " to 0-7)"
              }
          ]
      },
      {
          "type": "debugEditor",
          "attrs": {
              "type": 1
          }
      },
      {
          "type": "blockquote",
          "content": [
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "Notice that if you move the cursor to left most or right most ("
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "bold"
                              },
                              {
                                  "type": "textDecorationMark",
                                  "attrs": {
                                      "num": 4,
                                      "isBg": false
                                  }
                              }
                          ],
                          "text": "pos"
                      },
                      {
                          "type": "text",
                          "text": " = 0 or 7), it will create a new paragraph node. "
                      }
                  ]
              },
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "Choosing the right "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "bold"
                              },
                              {
                                  "type": "textDecorationMark",
                                  "attrs": {
                                      "num": 4,
                                      "isBg": false
                                  }
                              }
                          ],
                          "text": "pos"
                      },
                      {
                          "type": "text",
                          "text": " can represent insert before the (paragraph) node or the text. In this case "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "bold"
                              },
                              {
                                  "type": "textDecorationMark",
                                  "attrs": {
                                      "num": 4,
                                      "isBg": false
                                  }
                              }
                          ],
                          "text": "pos"
                      },
                      {
                          "type": "text",
                          "text": " 0 or 7 will insert before or after the node, thus editor automatically create a new node to contain the text and keep the schema valid. While "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "bold"
                              },
                              {
                                  "type": "textDecorationMark",
                                  "attrs": {
                                      "num": 4,
                                      "isBg": false
                                  }
                              }
                          ],
                          "text": "pos"
                      },
                      {
                          "type": "text",
                          "text": " 1-6 will insert at the position of the cursor."
                      }
                  ]
              }
          ]
      },
      {
          "type": "blockquote",
          "content": [
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "Normally ProseMirror’s "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "link",
                                  "attrs": {
                                      "href": "https://prosemirror.net/docs/ref/#view",
                                      "target": "_blank",
                                      "rel": "noopener noreferrer nofollow",
                                      "class": null
                                  }
                              }
                          ],
                          "text": "View"
                      },
                      {
                          "type": "text",
                          "text": " won’t allow placing the selector before the node itself. It would only allow to place around text so in this case it would only be selectable on 1-6 while using UI. But that doesn’t stop you via programmatically or custom behavior. "
                      }
                  ]
              },
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "This example is made to allow those behavior to see the different between cursor placing before the node or the text."
                      }
                  ]
              }
          ]
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 4
          },
          "content": [
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 3,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "2nd Example: Insert Node"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "How about inserting a node? Let say you create a button that insert a blockquote after the selected node, like our orange “Apply” button below. How would you programmatically find the correct "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " to insert? "
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "First play around the example and see how editor behave when insert a node at different position."
              }
          ]
      },
      {
          "type": "debugEditor",
          "attrs": {
              "type": 2
          }
      },
      {
          "type": "blockquote",
          "content": [
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "Similar to previous example, if you decide to insert a node in between the paragraph. The editor will notice that it is against our defined shema where paragraph isn’t allow to contain a "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "code"
                              }
                          ],
                          "text": "block"
                      },
                      {
                          "type": "text",
                          "text": " type node. "
                      }
                  ]
              },
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "Thus, it split the paragraph and insert the blockquote into doc level instead of inside the paragraph."
                      }
                  ]
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Let improve our inserting function. How can we ensure that the inserting doesn’t split the paragraph node? All you need to do is a little extra check the "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " before applying and adjust "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " accordingly."
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "For example, we might follow these steps:"
              }
          ]
      },
      {
          "type": "orderedList",
          "attrs": {
              "start": 1,
              "type": null
          },
          "content": [
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Resolve the "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              },
                              {
                                  "type": "text",
                                  "text": " into ResolvePos so we can get more information about it. This can either acquire from the selection or resolve the "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              },
                              {
                                  "type": "text",
                                  "text": " from doc."
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "From ResolvePos, check the parent of it. If we place "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              },
                              {
                                  "type": "text",
                                  "text": " between the text, the current node should be "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "code"
                                      }
                                  ],
                                  "text": "text"
                              },
                              {
                                  "type": "text",
                                  "text": " node and, thus, its parent is "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "code"
                                      }
                                  ],
                                  "text": "paragraph"
                              },
                              {
                                  "type": "text",
                                  "text": " node. Otherwise, if we place it outside the text, the "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              },
                              {
                                  "type": "text",
                                  "text": " will place at the "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "code"
                                      }
                                  ],
                                  "text": "doc"
                              },
                              {
                                  "type": "text",
                                  "text": " node. We could use this condition to decide how we handle the "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              },
                              {
                                  "type": "text",
                                  "text": "."
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "When the pos is between text, we will use the pos after the node. This can easily get by using "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "code"
                                      }
                                  ],
                                  "text": "ResolvePos.after()"
                              },
                              {
                                  "type": "text",
                                  "text": ". Otherwise, we will use the pos as is since it should locate on the "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "code"
                                      }
                                  ],
                                  "text": "doc"
                              },
                              {
                                  "type": "text",
                                  "text": " node and doesn’t violate our schema."
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          }
      },
      {
          "type": "debugEditor",
          "attrs": {
              "type": 3
          }
      },
      {
          "type": "blockquote",
          "content": [
              {
                  "type": "paragraph",
                  "attrs": {
                      "id": null
                  },
                  "content": [
                      {
                          "type": "text",
                          "text": "Now, even though the "
                      },
                      {
                          "type": "text",
                          "marks": [
                              {
                                  "type": "bold"
                              },
                              {
                                  "type": "textDecorationMark",
                                  "attrs": {
                                      "num": 4,
                                      "isBg": false
                                  }
                              }
                          ],
                          "text": "pos"
                      },
                      {
                          "type": "text",
                          "text": " is in between the paragraph, it will always insert either before or after the paragraph node."
                      }
                  ]
              }
          ]
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 2
          },
          "content": [
              {
                  "type": "text",
                  "text": "Extra?"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "We have come so far from"
              }
          ]
      },
      {
          "type": "bulletList",
          "content": [
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "understanding how "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              },
                              {
                                  "type": "text",
                                  "text": " work"
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "how to find the "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "using the "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              },
                              {
                                  "type": "text",
                                  "text": " for inserting"
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "What next shall we go on?"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "There are plenty more place where "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " is used, such as:"
              }
          ]
      },
      {
          "type": "bulletList",
          "content": [
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Delete range"
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Set selection"
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Add mark"
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Set decoration"
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "And there are some tricky situations when we keep applying transaction and the position shift. We could calculate manually or use "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "code"
                      }
                  ],
                  "text": "map"
              },
              {
                  "type": "text",
                  "text": " to help."
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "So let have one more example to explore more of these APIs."
              }
          ]
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 3
          },
          "content": [
              {
                  "type": "text",
                  "text": "Moving Node (Cut+Paste in one go)"
              }
          ]
      },
      {
          "type": "image",
          "attrs": {
              "src": "https://cdn.indevmined.com/image/1751470344532-cc94ebd3-de1a-4310-8f03-252a5ac2cc48.octet-stream",
              "alt": "move-node",
              "title": "move-node",
              "width": null
          }
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Before we write any code, let’s draft a plan first"
              }
          ]
      },
      {
          "type": "orderedList",
          "attrs": {
              "start": 1,
              "type": null
          },
          "content": [
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Find the hovered node "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              },
                              {
                                  "type": "text",
                                  "text": " like previous "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "link",
                                          "attrs": {
                                              "href": "#posAtCoords",
                                              "target": null,
                                              "rel": null,
                                              "class": null
                                          }
                                      }
                                  ],
                                  "text": "example"
                              },
                              {
                                  "type": "text",
                                  "text": " using "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "code"
                                      }
                                  ],
                                  "text": "posAtCoords"
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Find the drop "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              },
                              {
                                  "type": "text",
                                  "text": ", like step 1"
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Get the slice of the hovered node"
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Delete the hovered node from doc"
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Insert the slice on the drop "
                              },
                              {
                                  "type": "text",
                                  "marks": [
                                      {
                                          "type": "bold"
                                      },
                                      {
                                          "type": "textDecorationMark",
                                          "attrs": {
                                              "num": 4,
                                              "isBg": false
                                          }
                                      }
                                  ],
                                  "text": "pos"
                              }
                          ]
                      },
                      {
                          "type": "orderedList",
                          "attrs": {
                              "start": 1,
                              "type": null
                          },
                          "content": [
                              {
                                  "type": "listItem",
                                  "content": [
                                      {
                                          "type": "paragraph",
                                          "attrs": {
                                              "id": null
                                          },
                                          "content": [
                                              {
                                                  "type": "text",
                                                  "text": "Map the drop "
                                              },
                                              {
                                                  "type": "text",
                                                  "marks": [
                                                      {
                                                          "type": "bold"
                                                      },
                                                      {
                                                          "type": "textDecorationMark",
                                                          "attrs": {
                                                              "num": 4,
                                                              "isBg": false
                                                          }
                                                      }
                                                  ],
                                                  "text": "pos"
                                              },
                                              {
                                                  "type": "text",
                                                  "text": " to the new transaction"
                                              }
                                          ]
                                      }
                                  ]
                              },
                              {
                                  "type": "listItem",
                                  "content": [
                                      {
                                          "type": "paragraph",
                                          "attrs": {
                                              "id": null
                                          },
                                          "content": [
                                              {
                                                  "type": "text",
                                                  "text": "Insert the slice on updated drop "
                                              },
                                              {
                                                  "type": "text",
                                                  "marks": [
                                                      {
                                                          "type": "bold"
                                                      },
                                                      {
                                                          "type": "textDecorationMark",
                                                          "attrs": {
                                                              "num": 4,
                                                              "isBg": false
                                                          }
                                                      }
                                                  ],
                                                  "text": "pos"
                                              }
                                          ]
                                      }
                                  ]
                              }
                          ]
                      }
                  ]
              },
              {
                  "type": "listItem",
                  "content": [
                      {
                          "type": "paragraph",
                          "attrs": {
                              "id": null
                          },
                          "content": [
                              {
                                  "type": "text",
                                  "text": "Update the selection cursor"
                              }
                          ]
                      }
                  ]
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          }
      },
      {
          "type": "codeBlock",
          "attrs": {
              "id": null,
              "language": "typescript",
              "lineMark": [],
              "preview": null,
              "previewCenter": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "// import { TextSelection, Transaction } from '@tiptap/pm/state'\n// Assuming that step 1&2 are already done\n// by using `posAtCoords` like\n// the example from Coordinate XY\n// When listening to event 'dragstart' and 'dragend'\nfunction moveNode(\n  tr: Transaction,\n  hoveredNodePos: number,\n  dropPos: number\n) {\n  let newTr = tr\n  // Get node info so we could calculate \n  // the start and end position\n  const node = tr.doc.nodeAt(hoveredNodePos)\n  if (!node) return\n\n  const start = hoveredNodePos\n  const end = hoveredNodePos + node.nodeSize\n\n  // Step 3: Get the slice of the hovered node\n  const slice = tr.doc.slice(\n    hoveredNodePos,\n    hoveredNodePos + node.nodeSize\n  )\n\n  // Step 4: Delete the hovered node from doc\n  newTr = newTr.deleteRange(start, end)\n\n  // Step 5.1: Map the drop position to the new transaction\n  const updatedDropPos =\n    newTr.mapping."
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "highlightMark",
                          "attrs": {
                              "color": "red"
                          }
                      }
                  ],
                  "text": "map"
              },
              {
                  "type": "text",
                  "text": "(dropPos)\n  // Step 5.2: Insert the slice at the updated drop position\n  newTr = newTr.insert(\n    updatedDropPos,\n    slice.content\n  )\n\n  // Step 6: Update selection position to draggedNode node\n  const newSelection = "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "highlightMark",
                          "attrs": {
                              "color": "red"
                          }
                      }
                  ],
                  "text": "TextSelection"
              },
              {
                  "type": "text",
                  "text": ".create(\n    newTr.doc,\n    updatedDropPos + 1\n  )\n  newTr.setSelection(newSelection)\n\n  // Extra Step 7: Apply the transaction\n  // view.dispatch(newTr) -> if using view\n  // return newTr -> or return the transaction state for further use\n}"
              }
          ]
      },
      {
          "type": "heading",
          "attrs": {
              "id": null,
              "level": 2
          },
          "content": [
              {
                  "type": "text",
                  "text": "Ending"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Congratulation 🎉 If you have reach here, that mean you should have some idea what "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "bold"
                      },
                      {
                          "type": "textDecorationMark",
                          "attrs": {
                              "num": 4,
                              "isBg": false
                          }
                      }
                  ],
                  "text": "pos"
              },
              {
                  "type": "text",
                  "text": " is and how to use them to a certain level."
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Next step is your turn to try on your project!"
              }
          ]
      },
      {
          "type": "paragraph",
          "attrs": {
              "id": null
          },
          "content": [
              {
                  "type": "text",
                  "text": "Feel free to reach out if the tutorial is missing or wrong via email "
              },
              {
                  "type": "text",
                  "marks": [
                      {
                          "type": "link",
                          "attrs": {
                              "href": "mailto:me@supacheer.com",
                              "target": "_blank",
                              "rel": "noopener noreferrer nofollow",
                              "class": null
                          }
                      }
                  ],
                  "text": "me@supacheer.com"
              },
              {
                  "type": "text",
                  "text": "."
              }
          ]
      }
  ]
}