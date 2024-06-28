import ToggleSwitch from "@/components/buttons/ToggleSwitch";
import { useState } from "react";

const Notifications: React.FC = () => {
  // Push Notifications
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [loginAlertPush, setLoginAlertPush] = useState<boolean>(true);
  const [passwordChangesPush, setPasswordChangesPush] = useState<boolean>(true);
  const [newFollowerPush, setNewFollowerPush] = useState<boolean>(true);
  const [likedPostPush, setLikedPostPush] = useState<boolean>(true);
  const [commentedPostPush, setCommentedPostPush] = useState<boolean>(true);
  const [sharedPostPush, setSharedPostPush] = useState<boolean>(true);
  const [mentionedInPostPush, setMentionedInPostPush] = useState<boolean>(true);
  const [likedCommentPush, setLikedCommentPush] = useState<boolean>(true);
  const [repliedToCommentPush, setRepliedToCommentPush] =
    useState<boolean>(true);
  const [sharedCommentPush, setSharedCommentPush] = useState<boolean>(true);

  // Email Notifications
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [loginAlertEmail, setLoginAlertEmail] = useState(true);
  const [passwordChangesEmail, setPasswordChangesEmail] = useState(true);
  const [newFollowerEmail, setNewFollowerEmail] = useState(true);
  const [likedPostEmail, setLikedPostEmail] = useState(true);
  const [commentedPostEmail, setCommentedPostEmail] = useState(true);
  const [sharedPostEmail, setSharedPostEmail] = useState(true);
  const [mentionedInPostEmail, setMentionedInPostEmail] = useState(true);
  const [likedCommentEmail, setLikedCommentEmail] = useState(true);
  const [repliedToCommentEmail, setRepliedToCommentEmail] = useState(true);
  const [sharedCommentEmail, setSharedCommentEmail] = useState(true);

  return (
    <div>
      <h1 className="font-bold text-[25px]">Notifications</h1>
      {/* Push Notifications */}
      <div className="flex flex-col gap-[30px] mt-[30px]">
        <div>
          <h2 className="font-semibold text-[20px]">Push Notifications</h2>
          <p className="mt-2 mb-3">
            Enable or disable push notifications. Push notifications are sent
            directly to your device to keep you updated with the latest activity
            and important security updates.
          </p>
          <ToggleSwitch
            checked={pushNotifications}
            onChange={setPushNotifications}
            label={`${
              pushNotifications ? "Enabled" : "Disabled"
            } push notifications.`}
          />
        </div>
        <div className="flex flex-col gap-[15px]">
          <p className="font-bold">Security</p>
          <ToggleSwitch
            checked={loginAlertPush}
            onChange={setLoginAlertPush}
            label={
              <>
                <span className="font-semibold">Login Alert</span>: Push
                notifications about logins from new devices or locations.
              </>
            }
          />
          <ToggleSwitch
            checked={passwordChangesPush}
            onChange={setPasswordChangesPush}
            label={
              <>
                <span className="font-semibold">Password Changes</span>: Alerts
                for password changes or reset requests.
              </>
            }
          />
        </div>
        <div className="flex flex-col gap-[15px]">
          <p className="font-bold">Activity</p>
          <ToggleSwitch
            checked={newFollowerPush}
            onChange={setNewFollowerPush}
            label={<>New follower.</>}
          />
          <ToggleSwitch
            checked={likedPostPush}
            onChange={setLikedPostPush}
            label={<>Someone liked your post.</>}
          />
          <ToggleSwitch
            checked={commentedPostPush}
            onChange={setCommentedPostPush}
            label={<>Someone commented on your post.</>}
          />
          <ToggleSwitch
            checked={sharedPostPush}
            onChange={setSharedPostPush}
            label={<>Someone shared your post.</>}
          />
          <ToggleSwitch
            checked={mentionedInPostPush}
            onChange={setMentionedInPostPush}
            label={<>Someone mentioned you in a post.</>}
          />
          <ToggleSwitch
            checked={likedCommentPush}
            onChange={setLikedCommentPush}
            label={<>Someone liked your comment.</>}
          />
          <ToggleSwitch
            checked={repliedToCommentPush}
            onChange={setRepliedToCommentPush}
            label={<>Someone replied to your comment.</>}
          />
          <ToggleSwitch
            checked={sharedCommentPush}
            onChange={setSharedCommentPush}
            label={<>Someone shared your comment.</>}
          />
        </div>
      </div>
      {/* Email Notifications */}
      <div className="flex flex-col gap-[30px]">
        <div>
          <h2 className="font-semibold text-[20px] mt-[30px]">
            Email Notifications
          </h2>
          <p className="mt-2 mb-3">
            Enable or disable email notifications. Email notifications are sent
            to your inbox to keep you informed about account activity, security
            alerts, and the latest activity.
          </p>
          <ToggleSwitch
            checked={emailNotifications}
            onChange={setEmailNotifications}
            label={`${
              emailNotifications ? "Enabled" : "Disabled"
            } email notifications.`}
          />
        </div>
        <div className="flex flex-col gap-[15px]">
          <p className="font-bold">Security</p>
          <ToggleSwitch
            checked={loginAlertEmail}
            onChange={setLoginAlertEmail}
            label={
              <>
                <span className="font-semibold">Login Alert</span>: Email
                notifications about logins from new devices or locations.
              </>
            }
          />
          <ToggleSwitch
            checked={passwordChangesEmail}
            onChange={setPasswordChangesEmail}
            label={
              <>
                <span className="font-semibold">Password Changes</span>: Alerts
                for password changes or reset requests.
              </>
            }
          />
        </div>
        <div className="flex flex-col gap-[15px]">
          <p className="font-bold">Activity</p>
          <ToggleSwitch
            checked={newFollowerEmail}
            onChange={setNewFollowerEmail}
            label={<>New follower.</>}
          />
          <ToggleSwitch
            checked={likedPostEmail}
            onChange={setLikedPostEmail}
            label={<>Someone liked your post.</>}
          />
          <ToggleSwitch
            checked={commentedPostEmail}
            onChange={setCommentedPostEmail}
            label={<>Someone commented on your post.</>}
          />
          <ToggleSwitch
            checked={sharedPostEmail}
            onChange={setSharedPostEmail}
            label={<>Someone shared your post.</>}
          />
          <ToggleSwitch
            checked={mentionedInPostEmail}
            onChange={setMentionedInPostEmail}
            label={<>Someone mentioned you in a post.</>}
          />
          <ToggleSwitch
            checked={likedCommentEmail}
            onChange={setLikedCommentEmail}
            label={<>Someone liked your comment.</>}
          />
          <ToggleSwitch
            checked={repliedToCommentEmail}
            onChange={setRepliedToCommentEmail}
            label={<>Someone replied to your comment.</>}
          />
          <ToggleSwitch
            checked={sharedCommentEmail}
            onChange={setSharedCommentEmail}
            label={<>Someone shared your comment.</>}
          />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
