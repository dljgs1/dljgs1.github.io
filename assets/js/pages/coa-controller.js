const TOKEN_STORAGE_KEY = "coa_gist_panel_token";
const GIST_ID_STORAGE_KEY = "coa_gist_panel_gist_id";
const ACCOUNT_ALIAS_STORAGE_KEY = "coa_gist_panel_account_alias";
const COMMAND_FILE = "command.json";
const STATUS_FILE = "status.json";
const ACTION_COOLDOWN_MS = 10000;
const REFRESH_COOLDOWN_MS = 10000;

let actionCooldownUntil = 0;
let actionCooldownTimerId = null;
let refreshCooldownUntil = 0;
let refreshCooldownTimerId = null;

function setPageStatus(message, cssClass)
{
    const el = document.getElementById("page-status");
    el.textContent = message;
    el.className = ("status-message " + (cssClass || "")).trim();
}

function setValue(id, text, cssClass)
{
    const el = document.getElementById(id);
    el.textContent = text;
    el.className = ("status-value " + (cssClass || "")).trim();
}

function getTokenInput()
{
    return document.getElementById("token-input");
}

function getGistIdInput()
{
    return document.getElementById("gist-id-input");
}

function getAccountAliasInput()
{
    return document.getElementById("account-alias-input");
}

function getSweepOnlyCheckbox()
{
    return document.getElementById("sweep-only-checkbox");
}

function getRefreshStatusButton()
{
    return document.getElementById("refresh-status-button");
}

function getToken()
{
    const input = getTokenInput();
    return input ? input.value.trim() : "";
}

function getGistId()
{
    const input = getGistIdInput();
    return input ? input.value.trim() : "";
}

function getAccountAlias()
{
    const input = getAccountAliasInput();
    return input ? input.value.trim() : "";
}

function isSweepOnlyEnabled()
{
    const checkbox = getSweepOnlyCheckbox();
    return checkbox ? Boolean(checkbox.checked) : false;
}

function saveTokenToCache()
{
    const token = getToken();
    if (!token)
    {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        return;
    }
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

function saveGistIdToCache()
{
    const gistId = getGistId();
    if (!gistId)
    {
        window.localStorage.removeItem(GIST_ID_STORAGE_KEY);
        return;
    }
    window.localStorage.setItem(GIST_ID_STORAGE_KEY, gistId);
}

function loadTokenFromCache()
{
    const saved = window.localStorage.getItem(TOKEN_STORAGE_KEY) || "";
    const input = getTokenInput();
    if (input)
    {
        input.value = saved;
    }
}

function loadGistIdFromCache()
{
    const saved = window.localStorage.getItem(GIST_ID_STORAGE_KEY) || "";
    const input = getGistIdInput();
    if (input)
    {
        input.value = saved;
    }
}

function saveAccountAliasToCache()
{
    const alias = getAccountAlias();
    if (!alias)
    {
        window.localStorage.removeItem(ACCOUNT_ALIAS_STORAGE_KEY);
        return;
    }
    window.localStorage.setItem(ACCOUNT_ALIAS_STORAGE_KEY, alias);
}

function loadAccountAliasFromCache()
{
    const saved = window.localStorage.getItem(ACCOUNT_ALIAS_STORAGE_KEY) || "";
    const input = getAccountAliasInput();
    if (input)
    {
        input.value = saved;
    }
}

function resetSweepOnlyCheckbox()
{
    const checkbox = getSweepOnlyCheckbox();
    if (checkbox)
    {
        checkbox.checked = false;
    }
}

function clearSavedConnectionConfig()
{
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(GIST_ID_STORAGE_KEY);

    const tokenInput = getTokenInput();
    const gistIdInput = getGistIdInput();

    if (tokenInput)
    {
        tokenInput.value = "";
    }
    if (gistIdInput)
    {
        gistIdInput.value = "";
    }

    setPageStatus("已清除本地连接配置，请重新输入 Token 和 Gist ID。", "status-warn");
}

function ensureToken()
{
    const token = getToken();
    if (!token)
    {
        throw new Error("请先输入 GitHub Token");
    }
    return token;
}

function ensureGistId()
{
    const gistId = getGistId();
    if (!gistId)
    {
        throw new Error("请先输入 Gist ID");
    }
    return gistId;
}

function ensureConnectionConfig()
{
    return {
        token: ensureToken(),
        gistId: ensureGistId()
    };
}

function getActionButtons()
{
    return Array.from(document.querySelectorAll("[data-action-button]"));
}

function applyCooldownLabel(button, disabledByCooldown, remainingMs)
{
    if (!button.dataset.defaultLabel)
    {
        button.dataset.defaultLabel = button.textContent;
    }

    button.disabled = disabledByCooldown;
    if (disabledByCooldown)
    {
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        button.textContent = button.dataset.defaultLabel + " (" + remainingSeconds + "s)";
        return;
    }

    button.textContent = button.dataset.defaultLabel;
}

function updateActionButtonsState()
{
    const remaining = actionCooldownUntil - Date.now();
    const disabledByCooldown = remaining > 0;
    getActionButtons().forEach(function (button)
    {
        applyCooldownLabel(button, disabledByCooldown, remaining);
    });
}

function startActionCooldown()
{
    actionCooldownUntil = Date.now() + ACTION_COOLDOWN_MS;
    updateActionButtonsState();
    if (actionCooldownTimerId)
    {
        window.clearInterval(actionCooldownTimerId);
    }
    actionCooldownTimerId = window.setInterval(function ()
    {
        if (Date.now() >= actionCooldownUntil)
        {
            window.clearInterval(actionCooldownTimerId);
            actionCooldownTimerId = null;
            actionCooldownUntil = 0;
        }
        updateActionButtonsState();
    }, 200);
}

function ensureActionCooldownAvailable()
{
    const remainingMs = actionCooldownUntil - Date.now();
    if (remainingMs > 0)
    {
        const remainingSeconds = (remainingMs / 1000).toFixed(1);
        throw new Error("操作过于频繁，请 " + remainingSeconds + " 秒后再试");
    }
}

function updateRefreshButtonState()
{
    const button = getRefreshStatusButton();
    if (!button)
    {
        return;
    }

    const remainingMs = refreshCooldownUntil - Date.now();
    applyCooldownLabel(button, remainingMs > 0, remainingMs);
}

function startRefreshCooldown()
{
    refreshCooldownUntil = Date.now() + REFRESH_COOLDOWN_MS;
    updateRefreshButtonState();
    if (refreshCooldownTimerId)
    {
        window.clearInterval(refreshCooldownTimerId);
    }
    refreshCooldownTimerId = window.setInterval(function ()
    {
        if (Date.now() >= refreshCooldownUntil)
        {
            window.clearInterval(refreshCooldownTimerId);
            refreshCooldownTimerId = null;
            refreshCooldownUntil = 0;
        }
        updateRefreshButtonState();
    }, 200);
}

function ensureRefreshCooldownAvailable()
{
    const remainingMs = refreshCooldownUntil - Date.now();
    if (remainingMs > 0)
    {
        const remainingSeconds = (remainingMs / 1000).toFixed(1);
        throw new Error("刷新过于频繁，请 " + remainingSeconds + " 秒后再试");
    }
}

function formatDisplayTime(value)
{
    const raw = String(value || "").trim();
    if (!raw || raw === "--")
    {
        return "--";
    }

    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime()))
    {
        return raw;
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    const hour = String(parsed.getHours()).padStart(2, "0");
    const minute = String(parsed.getMinutes()).padStart(2, "0");
    const second = String(parsed.getSeconds()).padStart(2, "0");
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

function formatBool(value)
{
    if (value)
    {
        return ["是", "status-ok"];
    }
    return ["否", "status-bad"];
}

function robotPresentation(value)
{
    const normalized = String(value || "unknown").toLowerCase();
    if (normalized === "start" || normalized === "active" || normalized === "running")
    {
        return ["运行中", "status-ok"];
    }
    if (normalized === "end" || normalized === "stopped")
    {
        return ["已停止", "status-warn"];
    }
    return ["未知", "status-warn"];
}

async function fetchGist()
{
    const config = ensureConnectionConfig();
    const res = await fetch("https://api.github.com/gists/" + encodeURIComponent(config.gistId), {
        headers: {
            "Authorization": "token " + config.token,
            "Accept": "application/vnd.github+json"
        }
    });

    if (!res.ok)
    {
        throw new Error("HTTP " + res.status);
    }

    return await res.json();
}

async function patchGist(files)
{
    const config = ensureConnectionConfig();
    const res = await fetch("https://api.github.com/gists/" + encodeURIComponent(config.gistId), {
        method: "PATCH",
        headers: {
            "Authorization": "token " + config.token,
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ files: files })
    });

    if (!res.ok)
    {
        throw new Error("HTTP " + res.status);
    }

    return await res.json();
}

function buildCommand(action)
{
    const params = {};
    if (action === "COACN_OneTime")
    {
        const accountAlias = getAccountAlias();
        if (!accountAlias)
        {
            throw new Error("请先输入启动账号别名");
        }

        params.param1 = accountAlias;
        params.account_alias = accountAlias;
        if (isSweepOnlyEnabled())
        {
            params.param2 = "sweep_only_v2";
            params.behavior_program = "sweep_only_v2";
        }
    }

    return {
        version: 1,
        command_id: new Date().toISOString() + "_" + action,
        action: action,
        issued_at: new Date().toISOString(),
        params: params
    };
}

async function refreshStatusWithCooldown()
{
    try
    {
        ensureConnectionConfig();
        ensureRefreshCooldownAvailable();
        startRefreshCooldown();
        await refreshStatus();
    }
    catch (err)
    {
        setPageStatus("刷新失败：" + err.message, "status-bad");
    }
}

async function submitAction(action, label)
{
    try
    {
        ensureConnectionConfig();
        ensureActionCooldownAvailable();
        setPageStatus("正在发送：" + label + "...");
        const payload = buildCommand(action);
        startActionCooldown();
        await patchGist({
            [COMMAND_FILE]: {
                content: JSON.stringify(payload, null, 2)
            }
        });
        setPageStatus("已发送：" + label, "status-ok");
    }
    catch (err)
    {
        setPageStatus("发送失败：" + err.message, "status-bad");
    }
}

async function refreshStatus()
{
    if (!getToken() || !getGistId())
    {
        setPageStatus("请先输入 GitHub Token 和 Gist ID 后再刷新。", "status-warn");
        return;
    }

    setPageStatus("正在读取状态...");

    try
    {
        const gist = await fetchGist();
        const commandFile = gist.files && gist.files[COMMAND_FILE];
        const statusFile = gist.files && gist.files[STATUS_FILE];
        const commandRaw = commandFile && commandFile.content;
        const raw = statusFile && statusFile.content;

        if (!raw)
        {
            throw new Error("未找到状态文件 " + STATUS_FILE);
        }

        const data = JSON.parse(raw);
        const commandData = commandRaw ? JSON.parse(commandRaw) : {};
        const ack = (commandData && commandData.ack) || {};
        const cn = (data.coa && data.coa.cn) || {};
        const bridge = data.bridge || {};

        const runningPresentation = formatBool(Boolean(cn.running));
        const robotStatePresentation = robotPresentation(cn.robot_status);
        const nexusPresentation = formatBool(Boolean(cn.nexus_alive));

        setValue("running-state", runningPresentation[0], runningPresentation[1]);
        setValue("robot-state", robotStatePresentation[0], robotStatePresentation[1]);
        setValue("nexus-state", nexusPresentation[0], nexusPresentation[1]);
        setValue("last-alive", formatDisplayTime(cn.last_alive));

        const updatedAt = formatDisplayTime(data.updated_at);
        const debugAction = bridge.last_command_action || "--";
        const debugParams = bridge.last_command_params ? JSON.stringify(bridge.last_command_params) : "--";
        const ackCommandId = ack.command_id || "--";
        const ackConsumedBy = ack.consumed_by || "--";
        const ackConsumedAt = formatDisplayTime(ack.consumed_at);
        const ackStatus = ack.execute_status || "--";
        const ackMessage = ack.execute_message || "--";

        document.getElementById("last-result").textContent =
            "最近刷新: " + updatedAt + "\n" +
            "最近执行: " + (bridge.last_execute_status || "unknown") + "\n" +
            "说明: " + (bridge.last_execute_message || "--") + "\n" +
            "调试 action: " + debugAction + "\n" +
            "调试 params: " + debugParams + "\n" +
            "ACK command_id: " + ackCommandId + "\n" +
            "ACK consumed_by: " + ackConsumedBy + "\n" +
            "ACK consumed_at: " + ackConsumedAt + "\n" +
            "ACK execute_status: " + ackStatus + "\n" +
            "ACK execute_message: " + ackMessage;

        setPageStatus("状态读取成功", "status-ok");
    }
    catch (err)
    {
        setPageStatus("读取失败：" + err.message, "status-bad");
    }
}

function bindCacheEvents(input, saveHandler)
{
    if (!input)
    {
        return;
    }

    input.addEventListener("change", saveHandler);
    input.addEventListener("blur", saveHandler);
}

window.onload = function ()
{
    loadTokenFromCache();
    loadGistIdFromCache();
    loadAccountAliasFromCache();
    resetSweepOnlyCheckbox();

    bindCacheEvents(getTokenInput(), saveTokenToCache);
    bindCacheEvents(getGistIdInput(), saveGistIdToCache);
    bindCacheEvents(getAccountAliasInput(), saveAccountAliasToCache);

    updateActionButtonsState();
    updateRefreshButtonState();

    if (getToken() && getGistId())
    {
        refreshStatus();
    }
    else
    {
        setPageStatus("请先输入 GitHub Token 和 Gist ID 后再刷新。", "status-warn");
    }
};
