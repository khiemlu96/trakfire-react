'use strict';

var React = require("react");
var Component = require("react").Component;
var PropTypes = require("react").PropTypes;

var Pagination = require("react-bootstrap").Pagination;
var Panel = require("react-bootstrap").Panel;
var Well = require("react-bootstrap").Well;
var Button = require("react-bootstrap").Button;
var PageHeader = require("react-bootstrap").PageHeader;
var Modal = require("react-bootstrap").Modal;
var PostStore = require('../../stores/PostStore.js');

var Firebase = require("firebase");
var TfFirebaseRef = new Firebase("https://trakfire.firebaseio.com/");

var imagesInfoRef = TfFirebaseRef.child("carousal-images");
var originalImgRef = TfFirebaseRef.child("original-carousal-images");
var previewImgRef = TfFirebaseRef.child("preview-carousal-images");

var images = [], keys = [];
var delete_img_id = "";

function getSizeInMb(sizeInbytes) {
    return( ( sizeInbytes/ (1024 * 1024)).toFixed(2) );
}

function deleteImageAtKey(key) {
    var array = [];
    for(var id in images) {
        if( id !== key ) {
            array[id] = images[id];
        }
    }
    return array;
}

function compareCreatedAt(a, b) {
    if(a.createdAt > b.createdAt) return -1;
    else if(a.createdAt < b.createdAt) return 1;
    else if(a.createdAt == b.createdAt) return 1;
    return 0;
}

function toArray(obj) {
    var array1 = [], array2 = [], i = 0;
    var array = obj.sort(compareCreatedAt);
    return array;
}

var AdminBannerImagePage = React.createClass({

    getInitialState: function() {
        return {
            images: []
        };
    },

    componentDidMount: function() {
        var self = this;

        imagesInfoRef.orderByPriority().on("child_added", function(snapshot, prevChildKey) {
            var newImage = snapshot.val();
            var key = snapshot.key();
            images[key] = newImage;

            var previewKey = newImage.preview_ref_key;

            previewImgRef.child(previewKey).once('value', function(snapshot) {
                var pre_file = snapshot.val();                
                images[key].preview_file = pre_file.preview_file;

                self.setState({
                    images: images
                });
            });
        });

        imagesInfoRef.on("child_removed", function(snapshot) {
            var key = snapshot.key();            
            var img_del = snapshot.val();

            previewImgRef.child( img_del.preview_ref_key ).remove();
            originalImgRef.child( img_del.file_ref_key ).remove();

            images = deleteImageAtKey(key);

            self.setState({
                images: images
            });
        });
    },

    handleSubmit: function() {
        var file = this.refs.file.getDOMNode().files[0];        
        var reader = new FileReader();
        var img_height, img_width;
        var dateTime = new Date().valueOf();

        reader.onload = function(output){
            var newImageInfoRef = imagesInfoRef.push();
            var newOriginalImgRef = originalImgRef.push();
            var newPreviewImgRef = previewImgRef.push();

            var image   = new Image();            
            var dataurl = null;

            image.onload = function() {
                img_height = this.height;
                img_width = this.width;
                
                var canvas = document.createElement("canvas");                
                var ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0);

                canvas.width = 50;
                canvas.height = 50;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, 50, 50);

                dataurl = canvas.toDataURL(file.type);

                newImageInfoRef.setWithPriority({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    height: img_height,
                    width: img_width,
                    createdAt: dateTime,
                    lastModified: file.lastModified,
                    preview_ref_key: newPreviewImgRef.key(),
                    file_ref_key: newOriginalImgRef.key()
                }, 0 - Date.now());

                newPreviewImgRef.setWithPriority({
                    preview_file: dataurl
                }, 0 - Date.now());

                newOriginalImgRef.setWithPriority({
                    file: output.target.result
                }, 0 - Date.now());
            };

            image.src = output.target.result;
            //Push a new image into Firebase storage    

        }.bind(this);

        reader.readAsDataURL(file);
    },

    deleteImage: function() {
        imagesInfoRef.child(delete_img_id).remove();
        this.hideDelImagePopup();
    },

    uploadFile: function() {
        //Trigger a click event on File-Input
        $("#file-upload").trigger("click");
    },

    showDelImagePopup: function(key){
        delete_img_id = key;

        this.setState({
            showDelImagePopup : true
        });
    },

    hideDelImagePopup: function(){
        this.setState({
            showDelImagePopup : false
        });
    },

    renderImages: function() {
        var images = this.state.images;

        if( images !== undefined ) {
            var imagesGridHtml = [];            
            for(key in images ) {

                var image = images[key];
                var row = 
                    <tr className="gradeA odd" role="row">
                        <td className="sorting_1">{image.name}</td>                        
                        <td>{getSizeInMb(image.size)}</td>
                        <td className="center">
                            <div className="tf-preview-img-container">
                                <img className="tf-preview-img" src={image.preview_file}></img>
                            </div>
                        </td>
                        <td>{image.height} X {image.width}</td>
                        <td className="center">                                                            
                            <div className="col-md-6">
                                <a onClick={this.showDelImagePopup.bind(this, key)}><span><i className="fa fa-trash-o"></i></span>Del</a>
                            </div>
                        </td>
                    </tr>
                imagesGridHtml.push(row);
            }
            return imagesGridHtml;       
        } else {
            return(
                <tr className="aligned-centered" style={{display: 'table-row'}}>
                    <th colSpan="6"><center>No Result</center></th>
                </tr>
            );
        } 
    },

    render: function() {
        var renderImages = this.renderImages();

        return (
            <div>
                <div className="col-lg-12"> 
                    
                </div>

                <div className="col-lg-12"> 
                    <Panel header={<span>All Posts</span>}>
                        <div>
                            <div className="dataTable_wrapper">
                                <div id="dataTables-example_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">

                                    <div className="row">
                                        <div className="col-md-9">                                           
                                        </div>

                                        <div className="col-md-3 right">
                                            <Button className="right btn-primary tf-upload-btn" onClick={this.uploadFile}>Upload Image</Button>
                                            <input className="hidden" type="file" ref="file" id="file-upload" accept="image/*" name="myPic" onChange={this.handleSubmit} />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-12">
                                            <table className="table table-striped table-bordered table-hover dataTable no-footer" id="dataTables-example" role="grid" aria-describedby="dataTables-example_info">
                                                <thead>
                                                    <tr role="row">
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 265} }>Title</th>                                                        
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 231} }>Size(Mb)</th>
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 180} }>Preview</th>
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 299} }>Length x Width</th>
                                                        <th className="" tabIndex="0" rowSpan="1" colSpan="1" style={ {width: 299} }>Delete?</th>
                                                    </tr>
                                                </thead>
                                                <tbody>               
                                                    {renderImages}                          
                                                </tbody>
                                            </table>
                                            <div>
                                            <img className="hidden" id="uploaded-img-container"></img>
                                            </div>
                                        </div>
                                    </div>
                                
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="dataTables_info" id="dataTables-example_info" role="status" aria-live="polite">
                                                Showing 1 to 10 of 57 entries
                                            </div>
                                        </div>
                                        <div className="col-sm-6" pullRight >
                                            <Pagination activePage={1} items={6} perPage={10} first={true} last={true} prev={true} next={true}  />  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>

                    <div id="delete-modal-container">
                        <Modal id="delete-modal" show={this.state.showDelImagePopup} onHide={this.hideDelImagePopup}>
                            <Modal.Title>Confirm Delete?</Modal.Title>
                            <Modal.Body closeButton className="tf-modal-body">
                                <div className="row">Do you want to delete the Image?</div>
                                <div className="row">
                                    <Button onClick={this.deleteImage}>Yes</Button>
                                    <Button onClick={this.hideDelImagePopup}>Cancel</Button>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AdminBannerImagePage;