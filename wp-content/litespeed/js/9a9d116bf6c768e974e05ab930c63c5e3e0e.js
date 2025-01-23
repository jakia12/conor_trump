jQuery(document).ready(function($){"use strict"});'use strict';let trumps=document.querySelectorAll('.trump');document.addEventListener("mousemove",(e)=>{let middlehalf=window.innerWidth/2;if(e.clientX>middlehalf){trumps.forEach(trump=>{trump.classList.add("horiz")})}else{trumps.forEach(trump=>{trump.classList.remove("horiz")})}});const pro=document.getElementById("c");if(pro){const canvas=new fabric.Canvas("c",{width:800,height:600,preserveObjectStacking:!0,});if(window.innerWidth<486){canvas.setDimensions({width:400,height:500})}
let hasUploadedImages=!1;let state=[];let mods=0;const imageContainer=document.getElementById("image-container");function saveState(){const stateData=JSON.stringify(canvas);state.push(stateData);mods+=1}
canvas.on("object:added",function(){saveState()});canvas.on("object:modified",function(){saveState()});document.getElementById("undo-drawing").addEventListener("click",function(){if(mods<2)return;state.pop();mods-=1;canvas.clear();canvas.loadFromJSON(state[state.length-1],function(){canvas.renderAll()})});function adjustImageLayers(){let uploadedImages=[];let scriptGeneratedItems=[];let fullImagePresent=!1;canvas.getObjects().forEach((obj)=>{if(obj.type==="image"&&obj.uploaded){uploadedImages.push(obj)}else if(obj.src==="full.png"){fullImagePresent=obj}else if(obj.scriptGenerated){scriptGeneratedItems.push(obj)}});uploadedImages.reverse();uploadedImages.forEach((img)=>{canvas.bringToFront(img)});if(fullImagePresent&&hasUploadedImages){canvas.sendToBack(fullImagePresent)}
scriptGeneratedItems.forEach((item)=>{canvas.bringToFront(item)});canvas.renderAll()}
document.getElementById("upload").addEventListener("change",function(e){const reader=new FileReader();reader.onload=function(event){fabric.Image.fromURL(event.target.result,function(img){const scale=Math.min(canvas.width/img.width,canvas.height/img.height);img.set({originX:"center",originY:"center",left:canvas.width/2,top:canvas.height/2,scaleX:scale,scaleY:scale,selectable:!0,evented:!0,});canvas.add(img);adjustImageLayers();saveState();hasUploadedImages=!0})};reader.readAsDataURL(e.target.files[0])});let drawingState=[];document.getElementById("toggle-drawing").addEventListener("click",function(){canvas.isDrawingMode=!canvas.isDrawingMode;if(canvas.isDrawingMode){this.innerHtml="<span>Disable Drawing</span>";document.getElementById("color-picker").style.display="inline";document.getElementById("brush-size").style.display="inline";saveDrawingState()}else{this.innerHtml="<span>Enable Drawing</span>";document.getElementById("color-picker").style.display="none";document.getElementById("brush-size").style.display="none"}});function saveDrawingState(){canvas.toJSON((savedState)=>{drawingState.push(savedState)})}
document.getElementById("color-picker").addEventListener("change",function(){canvas.freeDrawingBrush.color=this.value});document.getElementById("brush-size").addEventListener("input",function(){canvas.freeDrawingBrush.width=parseInt(this.value,10)});document.getElementById("deleteObject").addEventListener("click",function(){const activeObject=canvas.getActiveObject();if(activeObject){!deleteActiveObjects()&&canvas.clear();canvas.requestRenderAll()}});document.addEventListener('keydown',(event)=>{event.keyCode===46&&deleteActiveObjects()})
function deleteActiveObjects(){const activeObjects=canvas.getActiveObjects();if(!activeObjects.length)return!1;if(activeObjects.length){activeObjects.forEach(function(object){canvas.remove(object)})}else{canvas.remove(activeObjects)}
return!0}
document.getElementById("add-text").addEventListener("click",function(){let text=new fabric.IText('There is a cat in every $BALL',{left:canvas.width/2,top:canvas.height/2,fill:'#111',fontFamily:"Caveat Brush",hasRotatingPoint:!1,centerTransform:!0,originX:'center',originY:'center',lockUniScaling:!0});canvas.add(text);if(document.getElementById("text-color-picker").style.display=="none"){document.getElementById("text-color-picker").style.display="inline"}else{document.getElementById("text-color-picker").style.display="none"}});document.getElementById("text-color-picker").addEventListener("change",function(){changeAttr("fill",this.value);document.getElementById("text-color-picker").style.display="none"});function changeAttr(attr,value){canvas.getActiveObject().set(attr,value);canvas.requestRenderAll()}
function getCanvasBounds(canvas){let minX=Infinity,minY=Infinity,maxX=0,maxY=0;if(canvas.backgroundImage){const img=canvas.backgroundImage;const imgWidth=img.width*img.scaleX;const imgHeight=img.height*img.scaleY;const imgLeft=canvas.width/2-imgWidth/2;const imgTop=canvas.height/2-imgHeight/2;minX=Math.min(minX,imgLeft);minY=Math.min(minY,imgTop);maxX=Math.max(maxX,imgLeft+imgWidth);maxY=Math.max(maxY,imgTop+imgHeight)}
canvas.forEachObject((obj)=>{obj.setCoords();const bound=obj.getBoundingRect(!0);minX=Math.min(minX,bound.left);minY=Math.min(minY,bound.top);maxX=Math.max(maxX,bound.left+bound.width);maxY=Math.max(maxY,bound.top+bound.height)});return{left:minX,top:minY,width:maxX-minX,height:maxY-minY}}
document.getElementById("generate").addEventListener("click",function(){const bounds=getCanvasBounds(canvas);canvas.setViewportTransform([1,0,0,1,-bounds.left,-bounds.top]);canvas.setWidth(bounds.width);canvas.setHeight(bounds.height);canvas.renderAll();const dataURL=canvas.toDataURL({format:"png",quality:1,});canvas.setViewportTransform([1,0,0,1,0,0]);canvas.setWidth(800);canvas.setHeight(600);canvas.renderAll();const imageWindow=window.open();if(imageWindow){imageWindow.document.write(`
            <html>
                <head>
                    <title>Generated Image</title>
                    <style>
                        body, html {
                            margin: 0;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            background: url('stars.mp4') no-repeat center center fixed;
                            background-size: cover;
                            color: white;
                            font-family: Arial, sans-serif;
                            text-align: center;
                        }
                        #background-video {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            z-index: -1;
                        }
                        .button-container {
                            margin-top: 20px;
                        }
                        button {
                            margin: 0 10px;
                            padding: 10px 20px;
                            font-size: 16px;
                            color: #fff;
                            background: linear-gradient(to right, #6a11cb, #2575fc);
                            border: none;
                            border-radius: 5px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            cursor: pointer;
                            transition: transform 0.2s ease, box-shadow 0.2s ease;
                        }
                        button:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
                        }
                        button:active {
                            transform: translateY(1px);
                            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.12);
                        }
                        .img-container {
                            border: 2px solid white;
                            display: inline-block;
                            padding: 10px;
                            background-color: rgba(0, 0, 0, 0.5);
                        }
                        .message {
                            margin-bottom: 20px;
                            font-size: 18px;
                        }
                    </style>
                </head>
                <body>
                    <div class="message">
                        We hope you share this on X so more people can see your BALL CAT. When redirected to X, your MINI image will be downloaded automatically. Just upload and send!
                    </div>
                    <div class="img-container">
                        <img src="${dataURL}" alt="Generated Image" style="max-width: 100%; height: auto;" />
                    </div>
                    <div class="button-container">
                        <button id="share-twitter">Download and Share on X</button>
                        <button id="download">Download</button>
                    </div>
                    <script>
                        document.getElementById('share-twitter').addEventListener('click', function() {
                            // Download the image
                            const a = document.createElement('a');
                            a.href = "${dataURL}";
                            a.download = 'ballcat.png';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            // Share on X
                            const tweetText = "Check out my generated $BALL CAT!";
                            const twitterUrl = \`https://x.com/intent/tweet?text=\${encodeURIComponent(tweetText)}\`;
                            window.open(twitterUrl, '_blank');
                        });

                        document.getElementById('download').addEventListener('click', function() {
                            const a = document.createElement('a');
                            a.href = "${dataURL}";
                            a.download = 'ballcat.png';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        });
                    </script>
                </body>
            </html>
        `)}else{alert("Popup blocked! Please allow popups for this website.")}});document.getElementById("bringToFront").addEventListener("click",function(){const activeObject=canvas.getActiveObject();if(activeObject){canvas.bringForward(activeObject)
canvas.renderAll()}else{alert("Please select an object to bring to front!")}});document.getElementById("sendToBack").addEventListener("click",function(){const activeObject=canvas.getActiveObject();if(activeObject){canvas.sendBackwards(activeObject)
canvas.renderAll()}else{alert("Please select an object to send to back!")}});let images=document.querySelectorAll('.image-item');images.forEach((image)=>{image.addEventListener("click",()=>{fabric.Image.fromURL(image.src,function(img){const scale=0.75;img.set({originX:"center",originY:"center",left:canvas.width/2,top:canvas.height/2,scaleX:scale,scaleY:scale,selectable:!0,evented:!0,});canvas.add(img);canvas.bringToFront(img);canvas.renderAll();saveState()})})})}
;