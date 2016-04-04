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
var UserStore = require('../../stores/UserStore.js');

var UserActions = require('../../actions/UserActions.js');

var Firebase = require("firebase");
var TfFirebaseRef = new Firebase("https://trakfire.firebaseio.com/");

var imagesInfoRef = TfFirebaseRef.child("carousal-images");
var originalImgRef = TfFirebaseRef.child("original-carousal-images");
var previewImgRef = TfFirebaseRef.child("preview-carousal-images");

var images = [], keys = [];
var delete_img = "";
var carousal_images = [];
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

function toArray(posts) {
	var array = [];
	for(key in posts) {
		array.push(posts[key]);
	}
	return array.sort(compareCreatedAt);
}

var AdminBannerImagePage = React.createClass({

	getInitialState: function() {
		return {
			images: [],
			admin_files: UserStore.getAdminCarousalFiles(),
			carousal_list_state: UserStore.getAdminCarousalFilesState(),
			current_page: 1
		};
	},

	getAdminCarousalFiles: function(data) {
		UserActions.getAdminCarousalFiles(this.props.origin + '/tf_files', data);
	},

	getFile: function(key, previewKey) {
		var self = this;

		previewImgRef.child( previewKey ).on('value', function(snapshot) {
			var pre_file = snapshot.val();
			carousal_images[key].preview_file = pre_file.preview_file;
			
			self.setState({
				admin_files: carousal_images
			});
		});
	},

	getCarousalFilesFromIds: function() {
		var self = this;
		carousal_images = this.state.admin_files;

		if( carousal_images !== null || carousal_images !== undefined ) {
			for(key in carousal_images ) {
				var previewKey = carousal_images[key].preview_file_firebase_key;
				self.getFile(key, previewKey);
			}
		}
	},

	componentDidMount: function() {
		var self = this;

		var data = {
			limit: 10,
			offset: 0,
			page: 1
		};

		self.getAdminCarousalFiles(data);
		UserStore.addChangeListener(self._onFilesStateChange);
	},

	handleSubmit: function() {
		var self = this;

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

				var fileData = {
					file: {
						name: file.name,
						size: file.size,
						height: img_height,
						width: img_width,
						file_type: file.type,
						file_firebase_key: newOriginalImgRef.key(),
						preview_file_firebase_key: newPreviewImgRef.key()
					}                    
				};
				UserActions.postFile(self.props.origin + '/tf_files', fileData);

				newPreviewImgRef.set({
					preview_file: dataurl
				});
				newOriginalImgRef.set({
					file: output.target.result
				});
			};

			image.src = output.target.result;
			//Push a new image into Firebase storage    

		}.bind(this);

		reader.readAsDataURL(file);
	},

	deleteImage: function(){
		UserActions.deleteCarousalFile(this.props.origin + "/tf_files/" + delete_img.id);
		previewImgRef.child( delete_img.preview_file_firebase_key ).remove();
		originalImgRef.child( delete_img.file_firebase_key ).remove();

		this.hideDelImagePopup();
	},

	uploadFile: function() {
		//Trigger a click event on File-Input
		$("#file-upload").trigger("click");
	},

	showDelImagePopup: function(file){
		delete_img = file;

		this.setState({
			showDelImagePopup : true
		});
	},

	hideDelImagePopup: function(){
		this.setState({
			showDelImagePopup : false
		});
	},

	selectNextPage: function(event, obj) {
		var states = this.state.carousal_list_state;      
		var offset = states.offset + states.limit;
		var current_page = obj.eventKey;

		var data = {
			limit: 10,
			offset: offset,
			page: current_page
		};

		this.getAdminCarousalFiles(data);

		this.setState({
			current_page: current_page
		});
	},

	renderCarousalImageList: function() {
		//var images = this.state.images;
		var admin_files = this.state.admin_files;
		admin_files = toArray(admin_files);

		if( admin_files !== undefined !== admin_files !== null ) {
			var imagesGridHtml = [];            
			for(key in admin_files ) {

				var image = admin_files[key];
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
								<a onClick={this.showDelImagePopup.bind(this, image)}><span><i className="fa fa-trash-o"></i></span>Del</a>
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

		var renderImages = this.renderCarousalImageList();       
		var states = this.state.carousal_list_state;
		var count = 0, limit_count = 0, total_count = 0, no_of_page = 0, limit = 0, offset = 0;

		if( states !== null ) {
			offset = parseInt(states.offset);
			count = offset + parseInt(states.page_count);
			limit_count = ( count > states.total_count ? states.total_count: count);
			total_count = parseInt(states.total_count);
			no_of_page = parseInt(states.no_of_page);
			limit = parseInt(states.limit);
		}
		
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
												Showing {offset} to {limit_count} of {total_count} entries
											</div>
										</div>
										<div className="col-sm-6" pullRight >
											<Pagination activePage={this.state.current_page} items={no_of_page} maxButtons={6} perPage={limit} first={true} last={true} prev={true} next={true} onSelect={ this.selectNextPage.bind(this) } />  
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
	},

	_onFilesStateChange: function() {
		this.setState({
			admin_files: UserStore.getAdminCarousalFiles(),
			carousal_list_state: UserStore.getAdminCarousalFilesState()
		});
		this.getCarousalFilesFromIds();
	}
});

module.exports = AdminBannerImagePage;