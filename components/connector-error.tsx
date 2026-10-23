import { LinkIcon } from 'lucide-react';
import { connectorErrorRecovery } from '@/lib/connector-errors.mjs';
/** Retained integration recovery component, independent of optional UI packages. */
export function ConnectorError({error,connectorName,reconnectHref}:{error:{status:string;message:string};connectorName:string;reconnectHref:string}){
 const recovery=connectorErrorRecovery(error,connectorName,reconnectHref);
 return <div role="alert"><p>{recovery.message}</p>{recovery.action&&<a className="secondary" href={recovery.action.href} target="_top"><LinkIcon size={16} aria-hidden="true"/>{recovery.action.label}</a>}</div>;
}
