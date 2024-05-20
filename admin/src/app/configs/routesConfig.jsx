import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import ExampleConfig from '../main/example/ExampleConfig';
import InjuryIllnessConfig from '../main/injury-illness/InjuryIllnessConfig';
import MedicalPracticeConfig from '../main/medical-practice/MedicalPracticeConfig';
import MedicineConfig from '../main/medicine/MedicineConfig';
import MedicinalEfficacyConfig from '../main/medicinal-efficacy/MedicinalEfficacyConfig';

import ICDtoDPCConfig from '../main/layer-1/ICDtoDPCConfig';
import AgeBirthWeightConfig from '../main/layer-1/AgeBirthWeightConfig';
import SurgeryConfig from '../main/layer-2/SurgeryConfig';
import Treatment1Config from '../main/layer-3/Treatment1Config';
import Treatment2Config from '../main/layer-3/Treatment2Config';
import SecondaryInjuryConfig from '../main/layer-3/SecondaryInjuryConfig';

const routeConfigs = [ExampleConfig, InjuryIllnessConfig,MedicalPracticeConfig, MedicineConfig, MedicinalEfficacyConfig, SignOutConfig, SignInConfig, SignUpConfig, ICDtoDPCConfig, AgeBirthWeightConfig, SurgeryConfig, Treatment1Config, Treatment2Config,SecondaryInjuryConfig ];
/**
 * The routes of the application.
 */
const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to="/example" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: '/',
		element: <Navigate to="/example2x" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: '/',
		element: <Navigate to="/injury" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: 'loading',
		element: <FuseLoading />
	},
	{
		path: '404',
		element: <Error404Page />
	},
	{
		path: '*',
		element: <Navigate to="404" />
	}
];
export default routes;
