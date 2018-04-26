const exportFun = (urlLink,token,uid,inputInner="") =>{
	let iframe = document.createElement('iframe');
         iframe.setAttribute('id','down-file-iframe');
          let form = document.createElement('form')
          form.target='down-file-iframe'
          form.method='POST'
          
        
           form.innerHTML=`<input type="hidden" name="CLIENT" value="6000" />\
		           <input type="hidden" name="BIT-UID" value="${uid}" />\
		           <input type="hidden" name="BIT-TOKEN" value="${token}" />\
		           <input type="hidden" name="DEVICE-TYPE" value="1" />\
		           <input type="hidden" name="DEVICE-ID" value="1" />\
		           <input type="hidden" name="OS" value="3" />\
		           <input type="hidden" name="OS-VERSION" value="1" />\
		           <input type="hidden" name="APP-VERSION" value="1" />\
		           <input type="hidden" name="PUSH-ID" value="1" />${inputInner}`
		          /* <input  name="province" value="${this.addressValue}" /> ` + (this.customerValue ? 
		          `<input  name="propId" value="${this.customerValue }" />` : '') +
		         `<input  name="houseName" value="${this.inputProjectName}"/>\
		          <input name="city" value="${this.cityValue}"/>\
		           <input  name="erea" value="${this.areaValue}"/>`;*/
          // form.innerHTML=form.innerHTML+customerValue+inputProjectName+city+erea;
          
          //  form.innerHTML=innerHTML+customerValue+inputProjectName+city+erea;
           form.setAttribute('action',`http://apielevator.test.bitiot.com.cn/v1${urlLink}`)
            iframe.appendChild(form)
            document.getElementsByTagName('body')[0].appendChild(iframe);

             form.submit();
             iframe.remove();
}

export{exportFun}