


exports.getXml = function getXml( json , backTime , word ){
	const backXML = `
			<xml>
				<ToUserName><![CDATA[${json.xml.FromUserName}]]></ToUserName>
				<FromUserName><![CDATA[${json.xml.ToUserName}]]></FromUserName>
				<CreateTime>${backTime}</CreateTime>
				<MsgType><![CDATA[text]]></MsgType>
				<Content><![CDATA[${word}]]></Content>
			</xml>
		`
	return backXML;
}; 