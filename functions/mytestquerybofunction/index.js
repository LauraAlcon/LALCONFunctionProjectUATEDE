/**
 * Describe mytestquerybofunction here.
 *
 * The exported method is the entry point for your code when the function is invoked. 
 *
 * Following parameters are pre-configured and provided to your function on execution: 
 * @param event: represents the data associated with the occurrence of an event, and  
 *                 supporting metadata about the source of that occurrence.
 * @param context: represents the connection to Functions and your Salesforce org.
 * @param logger: logging handler used to capture application logs and trace specifically
 *                 to a given execution of a function.
 */
 
 "use strict";

 export default async function (event, context, logger) {
  logger.info(
    `Invoking salesforcesdkjs Function with payload ${JSON.stringify(
      event.data || {}
    )}`
  );

  // Create a unit of work that inserts multiple objects.
  const uow = context.org.dataApi.newUnitOfWork();
 
   // Extract Properties from Payload
   const { s3bucket, s3key, clientid, codedemand, createddate,cups, invoicedate, fiscalcode, rcompanycode, passcode, processcode, companycode, sequential, cxsd } = event.data;

 
   // Validate the payload params
   if (!cxsd) {
     //throw new Error(`Please provide XSD value`);
     throw new Error(`Please provide the XSD value`);
   }
 
  
 
     // Query Big Object using the SalesforceSDK DataApi 
     const soql = `SELECT Created_date__c, S3_Bucket__c, S3_Key__c, Client_Identifier__c, Code_Demand_Case_XML__c, CUPS__c, Invoice_Date__c, Invoice_Fiscal_Code__c, Issuing_Company_Code__c, Pass_Code__c, Process_Code__c, Receiving_Company_Code__c, Sequential__c, Xsd__c FROM CTR_F1_invoice__b WHERE Xsd__c >= '${event.data.cxsd}' LIMIT 10`;
     const queryRes = await context.org.dataApi.query(soql);

     const queryResults = queryRes.records;


    for (const edato of queryResults){

    
        // Define a record using the RecordForCreate type and providing the Developer Name
        var vdata = uow.registerCreate({
            type: "CTR_F1_invoice_Mirror__c",
            fields: {
                    S3_Bucket__c: edato.S3_Bucket__c, 
                    S3_Key__c: edato.S3_Key__c, 
                    Client_Identifier__c: edato.Client_Identifier__c, 
                    Code_Demand_Case_XML__c: edato.Code_Demand_Case_XML__c, 
                    CUPS__c: edato.CUPS__c, 
                    Invoice_Date__c: edato.Invoice_Date__c, 
                    Invoice_Fiscal_Code__c: edato.Invoice_Fiscal_Code__c, 
                    Issuing_Company_Code__c: edato.Issuing_Company_Code__c, 
                    Pass_Code__c: edato.Pass_Code__c, 
                    Process_Code__c: edato.Process_Code__c, 
                    Receiving_Company_Code__c: edato.Receiving_Company_Code__c, 
                    Sequential__c: edato.Sequential__c, 
                    Xsd__c: edato.Xsd__c,
                    F1_enlace__c: "Function",
                },
        });

            // Insert the record using the SalesforceSDK DataApi and get the new Record Id from the result
           // const { id: recordId } = await context.org.dataApi.create(vdata);
            
    }
       
    try {
        // Commit the Unit of Work with all the previous registered operations
        const response = await context.org.dataApi.commitUnitOfWork(uow);
        // Construct the result by getting the Id from the successful inserts
        var result = {
            CTR_F1_invoice_Mirror__cId: response.get(CTR_F1_invoice_Mirror__c).id,
          };

        return result;

    } catch (err) {
     // Catch any DML errors and pass the throw an error with the message
     const errorMessage = `Failed to insert record. Root Cause : ${err.message}`;
     logger.error(errorMessage);
     throw new Error(errorMessage);
    }

 }

